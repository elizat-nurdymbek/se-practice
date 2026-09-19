def analyze_marks(marks, pass_mark=50):
    if not isinstance(pass_mark, (int, float)) or isinstance(pass_mark, bool):
        raise ValueError("pass_mark must be numeric")

    if not 0 <= pass_mark <= 100:
        raise ValueError("pass_mark must be between 0 and 100")

    marks = list(marks)

    if not marks:
        raise ValueError("marks cannot be empty")

    for mark in marks:
        if isinstance(mark, bool) or not isinstance(mark, (int, float)):
            raise ValueError("all marks must be numeric")
        if not 0 <= mark <= 100:
            raise ValueError("marks must be between 0 and 100")

    average = sum(marks) / len(marks)
    highest = max(marks)
    lowest = min(marks)
    passed = sum(mark >= pass_mark for mark in marks)
    pass_rate = (passed / len(marks)) * 100

    return {
        "average": round(average, 2),
        "highest": highest,
        "lowest": lowest,
        "pass_rate": round(pass_rate, 2)
    }


# Tests
print(analyze_marks([75]))
# {'average': 75.0, 'highest': 75, 'lowest': 75, 'pass_rate': 100.0}

print(analyze_marks([55.5, 70.5, 80.0]))
# {'average': 68.67, 'highest': 80.0, 'lowest': 55.5, 'pass_rate': 100.0}

print(analyze_marks([40, 60, 80], 70))
# {'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 33.33}

print(analyze_marks([40, 60, 80], 50))
# {'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 66.67}

# Empty list
try:
    analyze_marks([])
except ValueError as e:
    print(e)

# Text value
try:
    analyze_marks([50, "abc", 80])
except ValueError as e:
    print(e)

# Below 0
try:
    analyze_marks([-5, 50, 80])
except ValueError as e:
    print(e)

# Above 100
try:
    analyze_marks([50, 101, 80])
except ValueError as e:
    print(e)
