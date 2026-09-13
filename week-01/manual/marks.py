marks = ["abc", "", "xyz"]

valid_marks = []

for mark in marks:
    if isinstance(mark, (int, float)) and 0 <= mark <= 100:
        valid_marks.append(mark)

if len(valid_marks) == 0:
    print("No valid marks.")
else:
    count = len(valid_marks)
    average = sum(valid_marks) / count
    highest = max(valid_marks)
    lowest = min(valid_marks)

    passed = 0
    for mark in valid_marks:
        if mark >= 50:
            passed += 1

    pass_rate = (passed / count) * 100

    print(f"Number of valid marks: {count}")
    print(f"Average: {average:.2f}")
    print(f"Highest: {highest}")
    print(f"Lowest: {lowest}")
    print(f"Pass rate: {pass_rate:.1f}%")