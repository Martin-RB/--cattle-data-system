export class DateTimeOps{
    static daysBetween(date1: Date, date2: Date){
        let day = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((date1.getTime() - date2.getTime()) / day));
    }
}