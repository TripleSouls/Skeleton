module.exports = (GlobalVariables, Opt, index) => {
    const bugun = new Date();
    const gun = bugun.getDate();
    const ay = bugun.getMonth() + 1;
    const yil = bugun.getFullYear();
    const mesaj = `Bugün ${gun}.${ay}.${yil} - ${ay} ayının ${gun}. günü.`;
    console.log(mesaj);
}