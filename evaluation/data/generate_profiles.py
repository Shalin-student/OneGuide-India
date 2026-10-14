import json
import random

def generate_profiles(num_profiles=50):
    states = ["Gujarat", "Maharashtra", "Uttar Pradesh", "Bihar", "Karnataka"]
    categories = ["General", "OBC", "SC", "ST"]
    occupations = ["Student", "Farmer", "Unemployed", "Self-employed", "Salaried"]
    
    profiles = []
    for i in range(num_profiles):
        profiles.append({
            "profile_id": f"user_{i:03d}",
            "age": random.randint(16, 65),
            "income": random.choice([50000, 150000, 300000, 600000, 1000000]),
            "state": random.choice(states),
            "category": random.choice(categories),
            "occupation": random.choice(occupations),
            "gender": random.choice(["Male", "Female", "Other"])
        })
    return profiles

if __name__ == "__main__":
    profiles = generate_profiles(50)
    with open("synthetic_profiles.json", "w") as f:
        json.dump(profiles, f, indent=4)
    print("Generated 50 synthetic profiles for eligibility evaluation.")
