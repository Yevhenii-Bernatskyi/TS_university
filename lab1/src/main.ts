// інструкція
console.log(`
Інструкція функції triangle():
Функція приймає 4 аргументи у наступному порядку: 
значення 1, тип 1, значення 2, тип 2.

Можливі "типи" елементів:
- "leg"
- "hypotenuse"
- "adjacent angle"
- "opposite angle" 
- "angle" (коли задана гіпотенуза)
`);

// union для можливих рядкових значень
type ElementType = "leg" | "hypotenuse" | "adjacent angle" | "opposite angle" | "angle";

function triangle(val1: number, type1: ElementType, val2: number, type2: ElementType): string {
    // перевірка на допустимі типи

    const validTypes: string[] = ["leg", "hypotenuse", "adjacent angle", "opposite angle", "angle"];
    if (!validTypes.includes(type1) || !validTypes.includes(type2)) {
        console.log("Уведено неправильні типи. Перечитайте інструкцію.");
        return "failed";
    }

    // перевірка на додатні значення
    if (val1 <= 0 || val2 <= 0) {
        return "Zero or negative input";
    }

    // конвертація кутів
    const toRadians = (degrees: number): number => degrees * (Math.PI / 180);
    const toDegrees = (radians: number): number => radians * (180 / Math.PI);

    // для збереження результатів
    let a: number = 0;
    let b: number = 0;
    let c: number = 0;
    let alpha: number = 0;
    let beta: number = 0;

    // для групування вхідних даних незалежно від порядку
    let legs: number[] = [];
    let hypotenuse: number = 0;
    let adjAngle: number = 0;
    let oppAngle: number = 0;
    let angle: number = 0;

    // розподіл вхідних даних
    const processInput = (val: number, type: string): void => {
        switch (type) {
            case "leg": legs.push(val); break;
            case "hypotenuse": hypotenuse = val; break;
            case "adjacent angle": adjAngle = val; break;
            case "opposite angle": oppAngle = val; break;
            case "angle": angle = val; break;
        }
    };

    processInput(val1, type1);
    processInput(val2, type2);

    if (adjAngle >= 90 || oppAngle >= 90 || angle >= 90) {
        return "Гострий кут повинен бути меншим за 90 градусів";
    }

    // оснвна логіка обчислень
    if (legs.length === 2) {
        // два катети
        a = legs[0];
        b = legs[1];
        c = Math.sqrt(a * a + b * b);
        alpha = toDegrees(Math.atan(a / b));
        beta = 90 - alpha;

    } else if (legs.length === 1 && hypotenuse > 0) {
        // катет і гіпотенузу
        a = legs[0];
        c = hypotenuse;
        if (a >= c) {
            return "Катет не може бути більшим або дорівнювати гіпотенузі";
        }
        b = Math.sqrt(c * c - a * a);
        alpha = toDegrees(Math.asin(a / c));
        beta = 90 - alpha;

    } else if (legs.length === 1 && oppAngle > 0) {
        // катет і протилежний кут
        a = legs[0];
        alpha = oppAngle;
        beta = 90 - alpha;
        c = a / Math.sin(toRadians(alpha));
        b = Math.sqrt(c * c - a * a);

    } else if (legs.length === 1 && adjAngle > 0) {
        // катет і прилеглий кут
        a = legs[0];
        beta = adjAngle;
        alpha = 90 - beta;
        c = a / Math.cos(toRadians(beta));
        b = Math.sqrt(c * c - a * a);

    } else if (hypotenuse > 0 && angle > 0) {
        // гіпотенузу і гострий кут
        c = hypotenuse;
        alpha = angle;
        beta = 90 - alpha;
        a = c * Math.sin(toRadians(alpha));
        b = c * Math.cos(toRadians(alpha));

    } else {
        console.log("Уведено несумісну пару типів.");
        return "failed";
    }

    // вивід
    console.log(`a = ${a}`);
    console.log(`b = ${b}`);
    console.log(`c = ${c}`);
    console.log(`alpha = ${alpha}`);
    console.log(`beta = ${beta}`);

    return "success";
}
(window as any).triangle = triangle;