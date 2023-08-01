const inData = 'user.name.firstname=Bob&user.name.lastname=Smith&user.favoritecolor=Light%20Blue&expiriments.theme=dark';
// const output = {
//     user:{
//         lastname: 'Bob',
//         firstname: 'Smith',
//         favoritecolor:'Light-Blue'
//     },
//     expiriments: {
//         theme:'dark'
//     }
// }

'user.name.firstname=Bob',
'user.name.lastname=Smith',
'user.favoritecolor=Light%20Blue',
'expiriments.theme=dark'

const parseStringToObject = (input) => {
    const dataArr = input.split('&');
    const result = dataArr.reduce((acc, string) => {
        let arrSubstr = string.split('.');
        let current = acc;
        let arrWithValue;


        return acc;
    }, {})

    //console.log(dataArr);
    console.log(result)
}

parseStringToObject(inData)

// arrSubstr.forEach((item) => {
//     if(item.indexOf('=') !== -1){
//         arrWithValue = item.split('=');
//         current[arrWithValue[0]] = decodeURIComponent(arrWithValue[1]);
//         return;
//     }else if(current[item]){
//         current = current[item];
//         return;
//     }else{
//         current[item] = {};
//         current = current[item];
//     }
// })