import json

# Synthetic queries for retrieval evaluation
queries = [
    {
        "id": "q1",
        "text": "scholarship for sc student in engineering",
        "language": "en",
        "gold_document_ids": ["sch_045", "sch_012"],
        "category": "scholarship"
    },
    {
        "id": "q2",
        "text": "kisan samman nidhi yojana apply",
        "language": "hi",
        "gold_document_ids": ["agri_001", "agri_002"],
        "category": "agriculture"
    },
    {
        "id": "q3",
        "text": "fre laptap sceme for stydent gujarat", # Intentional misspelling
        "language": "en",
        "gold_document_ids": ["sch_089"],
        "category": "schemes"
    },
    {
        "id": "q4",
        "text": "ma amrutam card documents required",
        "language": "en",
        "gold_document_ids": ["doc_015"],
        "category": "documents"
    },
    {
        "id": "q5",
        "text": "bina byaj loan for business",
        "language": "hi",
        "gold_document_ids": ["scheme_055", "scheme_056"],
        "category": "loans"
    }
]

# Adding more generic ones to simulate the 100 query set
for i in range(6, 101):
    queries.append({
        "id": f"q{i}",
        "text": f"synthetic query sample {i}",
        "language": "en" if i % 2 == 0 else "hi",
        "gold_document_ids": [f"doc_synth_{i}"],
        "category": "mixed"
    })

if __name__ == "__main__":
    with open("query_set.json", "w") as f:
        json.dump(queries, f, indent=4)
    print("Generated 100 synthetic queries for evaluation.")
