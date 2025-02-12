
export default function dataFormatter(isoString: string | undefined) {
    if (isoString){
        // Создаем объект Date
        const date = new Date(isoString);

        // Получаем компоненты даты
        const day = String(date.getUTCDate()).padStart(2, '0'); // День (с ведущим нулем)
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Месяц (с ведущим нулем)
        const year = date.getUTCFullYear(); // Год

        // Форматируем дату в формат DD.MM.YYYY
        const formattedDate = `${day}.${month}.${year}`;

        return(formattedDate)
    }
    else{return("wrong data format")}
}