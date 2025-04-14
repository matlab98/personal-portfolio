const formatterHour = (tiempo) => {
    let reference = new Date(tiempo);
    let date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(reference);
    console.log("error",date)
    return date; 
}

const whatHour = (tiempo) => {
    let reference = new Date(tiempo);
    let date = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(reference);
    console.log("error",date)
    return date; 
}

const formatterDate = (tiempo) => {
    let reference = new Date(tiempo);
    let date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(reference)
    let hoy = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
    let tomorrow = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date().getTime()+(1000 * 60 * 60 * 24))

    let day = reference.getDate()
    let month = reference.getMonth() + 1

const dias = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

if(date==hoy){
    return "Hoy ";
} else if(tomorrow==date) {
    return "Mañana ";
} else {
    const numeroDia = new Date(date).getDay();
const nombreDia = dias[numeroDia];
    return nombreDia +" "+`${day}-0${month}`;}
}

export default { formatterDate, whatHour, formatterHour}