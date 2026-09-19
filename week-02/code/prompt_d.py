def analyze_marks(marks, pass_mark=50):
    marks = list(marks)

    if not marks:
        raise ValueError("marks cannot be empty")

    for mark in marks:
        if isinstance(mark, bool) or not isinstance(mark, (int, float)):
            raise ValueError("marks must contain only numeric values")
        if mark < 0 or mark > 100:
            raise ValueError("marks must be between 0 and 100")

    average = sum(marks) / len(marks)
    highest = max(marks)
    lowest = min(marks)
    pass_rate = round(
        sum(mark >= pass_mark for mark in marks) / len(marks) * 100,
        2
    )

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate
    }


# Tests
assert analyze_marks([40, 60, 80], 50) == {
    "average": 60,
    "highest": 80,
    "lowest": 40,
    "pass_rate": 66.67
}

assert analyze_marks([100], 50) == {
    "average": 100,
    "highest": 100,
    "lowest": 100,
    "pass_rate": 100.0
}

assert analyze_marks([49.5, 50], 50) == {
    "average": 49.75,
    "highest": 50,
    "lowest": 49.5,
    "pass_rate": 50.0
}

try:
    analyze_marks([], 50)
    assert False
except ValueError:
    pass

try:
    analyze_marks([40, "60"], 50)
    assert False
except ValueError:
    pass

try:
    analyze_marks([-1, 50, 101], 50)
    assert False
except ValueError:
    pass
