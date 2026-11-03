export function todayIST(): string{
    return new Date().toLocaleDateString("en-CA", { timeZone:"Asia/Kolkata"});
}
function weekdayIST(date:Date): string{
return date.toLocaleDateString("en-IN",{ timeZone:"Asia/Kolkata", weekday:"long"});
}
function isoDateIST(date:Date):string{
    return date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export function upcomingDatesIST():string{
    const lines: string[] = [];
    for(let i = 1; i <= 7; i++){
        const d = new Date(Date.now() + i * 86_400_000);
        lines.push(`- ${weekdayIST(d)} ${isoDateIST(d)}`);
    }
    return lines.join("\n");
}

export function todayLabelIST():string{
    const now = new Date();
    return `${weekdayIST(now)}, ${isoDateIST(now)}`
}