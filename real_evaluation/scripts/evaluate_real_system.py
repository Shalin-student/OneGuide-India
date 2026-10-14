import json
import requests
import math

# Configuration
API_ENDPOINT = "http://localhost:5000/api/schemes/search" # Adjust to your actual search endpoint
QUERIES_FILE = "../data/queries.json"

def get_retrieved_ids(query_text):
    """
    Hits your actual OneGuide backend and returns the ranked list of resource IDs.
    You will need to adjust the request payload/params to match your actual API.
    """
    try:
        # Example: GET /api/schemes/search?q=...
        response = requests.get(API_ENDPOINT, params={"q": query_text})
        if response.status_code == 200:
            results = response.json()
            # Extract the ID field from your actual schema (e.g., '_id' or 'schemeId')
            return [str(item.get('_id')) for item in results.get('data', [])]
        else:
            print(f"API Error for query '{query_text}': {response.status_code}")
            return []
    except Exception as e:
        print(f"Connection Error: {e}")
        return []

def calculate_precision_at_k(retrieved, expected, k=5):
    retrieved_k = retrieved[:k]
    relevant = set(retrieved_k).intersection(set(expected))
    return len(relevant) / k if k > 0 else 0

def calculate_recall_at_k(retrieved, expected, k=5):
    retrieved_k = retrieved[:k]
    relevant = set(retrieved_k).intersection(set(expected))
    return len(relevant) / len(expected) if len(expected) > 0 else 0

def calculate_mrr(retrieved, expected):
    for i, doc_id in enumerate(retrieved):
        if doc_id in expected:
            return 1.0 / (i + 1)
    return 0.0

def dcg_at_k(retrieved, expected, k=5):
    dcg = 0.0
    for i, doc_id in enumerate(retrieved[:k]):
        if doc_id in expected:
            # simple binary relevance: 1 if expected, 0 otherwise
            dcg += 1.0 / math.log2(i + 2)
    return dcg

def calculate_ndcg_at_k(retrieved, expected, k=5):
    actual_dcg = dcg_at_k(retrieved, expected, k)
    # ideal dcg: all expected items appear at the top
    ideal_retrieved = expected[:k] 
    ideal_dcg = dcg_at_k(ideal_retrieved, expected, k)
    return actual_dcg / ideal_dcg if ideal_dcg > 0 else 0.0

def run_evaluation():
    with open(QUERIES_FILE, 'r') as f:
        queries = json.load(f)

    metrics = {"p_at_5": [], "r_at_5": [], "mrr": [], "ndcg_at_10": []}

    print(f"Evaluating {len(queries)} queries against actual backend...")
    
    for q in queries:
        query_text = q['query']
        expected_ids = q['expected_resource_ids']
        
        # Skip incomplete templates
        if not expected_ids or expected_ids[0].startswith("fill_in"):
            continue

        retrieved_ids = get_retrieved_ids(query_text)

        p5 = calculate_precision_at_k(retrieved_ids, expected_ids, k=5)
        r5 = calculate_recall_at_k(retrieved_ids, expected_ids, k=5)
        mrr = calculate_mrr(retrieved_ids, expected_ids)
        ndcg10 = calculate_ndcg_at_k(retrieved_ids, expected_ids, k=10)

        metrics["p_at_5"].append(p5)
        metrics["r_at_5"].append(r5)
        metrics["mrr"].append(mrr)
        metrics["ndcg_at_10"].append(ndcg10)

    if not metrics["p_at_5"]:
        print("No valid queries found. Please fill in expected_resource_ids in queries.json.")
        return
    
    def mean(lst):
        return sum(lst) / len(lst) if lst else 0

    print("\n=== FINAL RESULTS (ACTUAL SYSTEM) ===")
    print(f"Precision@5: {mean(metrics['p_at_5']):.3f}")
    print(f"Recall@5:    {mean(metrics['r_at_5']):.3f}")
    print(f"MRR:         {mean(metrics['mrr']):.3f}")
    print(f"nDCG@10:     {mean(metrics['ndcg_at_10']):.3f}")

if __name__ == "__main__":
    run_evaluation()
