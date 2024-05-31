export function formatToWon(price: number) {
    return price.toLocaleString("ko-KR");
}

export function formatToTimeAgo(date: string) {
    const dayInMs = 1000 * 60 * 60 * 24;
    const time = new Date(date).getTime();
    const now = new Date().getTime();
    const diff = Math.round((time - now) / dayInMs);

    const formatter = new Intl.RelativeTimeFormat("ko");

    return diff === 0 ? '오늘' : formatter.format(diff, "days");
} 