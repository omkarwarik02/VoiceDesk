export function todayIST(): string{
    return new Date().toLocaleDateString("en-CA", { timeZone:"Asia/Kolkata"});
}