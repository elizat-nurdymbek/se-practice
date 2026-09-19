marks = input("Enter student marks separated by commas: ").split(",")

valid_marks = []

for mark in marks:
    try:
        score = float(mark.strip())
        if 0 <= score <= 100:
            valid_marks.append(score)
    except ValueError:
        continue

if valid_marks:
    average = sum(valid_marks) / len(valid_marks)
    highest = max(valid_marks)
    lowest = min(valid_marks)
    pass_rate = sum(score >= 50 for score in valid_marks) / len(valid_marks) * 100

    print(f"Number of valid marks: {len(valid_marks)}")
    print(f"Average: {average:.1f}")
    print(f"Highest: {highest:g}")
    print(f"Lowest: {lowest:g}")
    print(f"Pass rate: {pass_rate:.1f}%")
else:
    print("No valid marks.")
