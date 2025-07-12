# Github-User-Activity

Project Url : https://roadmap.sh/projects/expense-tracker

## Description

Expense tracker is a project which can be used to manage your expenses. Add, delete, update, list or get a summary of all your expenses or for a specific month. Each expense has an id, description, date-added and amount spent.

## Example

Example
The list of commands and their usage is given below:

### Adding a new expense
add --description "Buy groceries" --amount 10
### Output: Expense added successfully (ID: 1)

### Updating and deleting expenses
update --id 1 --description "Buy groceries and desert" --amount 20
delete --id 1

### Listing all expenses
list

### Summary of all expenses
summary
summary --month 7