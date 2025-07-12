class Expense {
    constructor(id, desc, date, amount) {
        this.id = id;
        this.description = desc;
        this.date = date;
        this.amount = amount;
    }
}

const command = process.argv.slice(2), commandType= command[0];
const fs = require('fs/promises');
let allExpenses = [];
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

async function read() {
    let exist = await fs.access('./expenses.json').then(() => true).catch(() => false);
    if (exist) {
        allExpenses = JSON.parse(await fs.readFile('./expenses.json'));
    }   
}

async function write() {
    await fs.writeFile('./expenses.json', JSON.stringify(allExpenses, null, 2));
}

const formateDate = (date) => {
    let d = new Date(date);
    let year = d.getFullYear(), month = ''+(d.getMonth() + 1), day = '' + d.getDate();
    if (month.length < 2) month = '0'+month;
    if (day.length < 2) day = '0'+day;
    return `${year}-${month}-${day}`;
}

async function main() {
    await read();
    switch (commandType) {
        case 'add':
            const description = command[command.indexOf('--description') == -1 ? null : command.indexOf('--description') + 1];
            const amount = command[command.indexOf('--amount') == -1 ? null : command.indexOf('--amount') + 1];
            if (!description || !amount) {
                console.log('Missing description or amount');
                process.exit(1);
            }
            
            const exp = new Expense(allExpenses.length>0 ? allExpenses[allExpenses.length - 1].id +1 : 1, description, formateDate(new Date().toDateString()), amount);
            allExpenses.push(exp);
            await write();
            console.log(`Expense added successfully (ID : ${exp.id})`);
            break;
        
        case 'list':
            let allExpensesString = `ID  Date        Description  Amount`;
            allExpenses.forEach(expense => {
                allExpensesString += `\n${expense.id.toString().padEnd(2)}  ${expense.date.padEnd(9)}   ${expense.description.padEnd(10)}   $${expense.amount}`;
            });
            console.log(allExpensesString);
            break;
        
        case 'summary':
            if (command.indexOf('--month') == -1) {
                const sum = allExpenses.reduce((acc, currVal) => acc + parseInt(currVal.amount), 0);
                console.log(`Total Expenses : $${sum}`);
            }
            else {
                const month = command[command.indexOf('--month') + 1];
                const sum = allExpenses.reduce((acc, currVal) => {
                    const date = new Date(currVal.date);
                    let sum = 0;
                    if (date.getMonth() + 1 == month)
                        return acc + parseInt(currVal.amount);
                    return acc;
                }, 0);
                console.log(`Total Expenses for month ${monthNames[month-1]}: $${sum}`);
            }
            break;

        case 'delete':
            const inputId = command[command.indexOf('--id') == -1 ? null : command.indexOf('--id') + 1];
            const filteredArray = allExpenses.filter(exp => parseInt(exp.id) != inputId);
            if (allExpenses.length == filteredArray.length) {
                console.log(`Expense ID : ${inputId} not present`);
                process.exit(1);
            }
            allExpenses = filteredArray;
            console.log(`Expense deleted successfully`);
            await write();
            break;

        case 'update':
            const inputIdUpdt = command[command.indexOf('--id') == -1? null : command.indexOf('--id') + 1];
            const expenseUpdt = allExpenses.find(exp => parseInt(exp.id) == inputIdUpdt);
            if (expenseUpdt == null) {
                console.log(`No such expense with ID : ${inputIdUpdt} exists`);
                process.exit(1);
            }

            const descriptionUpdt = command[command.indexOf('--description') == -1? null : command.indexOf('--description') + 1];
            const amountUpdt = command[command.indexOf('--amount') == -1? null : command.indexOf('--amount') + 1];
            allExpenses = allExpenses.map(exp => parseInt(exp.id) == inputIdUpdt ? {
                ...exp, 
                description : (descriptionUpdt == null) ? exp.description : descriptionUpdt,
                amount : (amountUpdt==null) ? exp.amount : amountUpdt
            } : exp);
            await write();
            break;

        default :
            console.log('Invalid Command');
            break;
    }
}

(async () => await main())();