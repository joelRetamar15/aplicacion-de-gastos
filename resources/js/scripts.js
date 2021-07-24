const form = document.getElementById('transactionForm')
form.addEventListener('submit', function (event) {
    event.preventDefault()
    let transactionFormData = new FormData(form)
    const transactionObj = convertFormDataToTransactionObj(transactionFormData)
    const newId = transactionObj.transactionId
    saveTransactionObj(transactionObj)
    insertRowInTransactionTable(transactionObj, newId)
    form.reset()
})

function drawCategories() {
    let categories = ['Alquiler', 'Comida', 'Diversion', 'Gasto', 'Transporte']
    categories.forEach(category => {
        insertCategory(category)
    })
}

function insertCategory(category) {
    const selecElement = document.getElementById('transactionCategory')
    let html = `<option> ${category} </option>`
    selecElement.insertAdjacentHTML('beforeend', html)
}

document.addEventListener('DOMContentLoaded', function () {
    let transactionArrayObj = JSON.parse(localStorage.getItem('transactionData'))
    drawCategories()
    if (getLastTransactionId() !== -1) {
        transactionArrayObj.forEach(element => {
            insertRowInTransactionTable(element, element.transactionId)
        });
    }
})

function convertFormDataToTransactionObj(transactionFormData) {
    let transactionType = transactionFormData.get('type')
    let transactionDescription = transactionFormData.get('transactionDescription')
    let transactionAmount = transactionFormData.get('transactionAmount')
    let transactionCategory = transactionFormData.get('transactionCategory')
    let transactionId = getNewTransactionId()
    return {
        'transactionType': transactionType,
        'transactionDescription': transactionDescription,
        'transactionAmount': transactionAmount,
        'transactionCategory': transactionCategory,
        'transactionId': transactionId
    }
}
function getNewTransactionId() {
    let lastTransactionId = localStorage.getItem('lastTransactionId') || '-1'
    let newTransactionId = JSON.parse(lastTransactionId) + 1
    localStorage.setItem('lastTransactionId', JSON.stringify(newTransactionId))
    return newTransactionId

}

function getLastTransactionId() {
    let lastTransactionId = localStorage.getItem('lastTransactionId')
    let newTransactionId = JSON.parse(lastTransactionId)
    return newTransactionId
}

function deleteTransactionId() {
    let lastTransactionId = localStorage.getItem('lastTransactionId')
    let newTransactionId = JSON.parse(lastTransactionId) - 1
    localStorage.setItem('lastTransactionId', JSON.stringify(newTransactionId))

}
// le paso como parametro transactionId de la transaccion que quiero eliminar
function deleteTransactionObj(transactionId) {
    //obtengo las transacciones de base de datos (desconvierto de json a objeto) 
    let transactionObjArr = JSON.parse(localStorage.getItem('transactionData'))
    // busco el indice/ la posicion de la transaccion que quiero eliminar
    let transactionIndexInArray = transactionObjArr.findIndex(element => element.transactionId === transactionId)
    console.log("index", transactionIndexInArray)
    //Elimino el elemento de esa posicion 
    transactionObjArr.splice(transactionIndexInArray, 1)
    // convierto de objeto json
    let transactionArrayJson = JSON.stringify(transactionObjArr)
    // guardo mi array de transaccion en formato json en el localStorage
    localStorage.setItem('transactionData', transactionArrayJson)
    deleteTransactionId()
}



function saveTransactionObj(transactionObj) {
    let myTransactionArray = JSON.parse(localStorage.getItem('transactionData')) || []
    myTransactionArray.push(transactionObj)
    let transactionObjJson = JSON.stringify(myTransactionArray)
    localStorage.setItem('transactionData', transactionObjJson)
}

function insertRowInTransactionTable(transactionObj, id = -1) {
    let transactionTable = document.getElementById('transactionTable')
    let newTransactionRow = transactionTable.insertRow(-1)

    if (id != -1) {
        newTransactionRow.setAttribute('data-transaction-id', id)
    }
    let newTypeCell = newTransactionRow.insertCell(0)
    newTypeCell.textContent = transactionObj['transactionType']

    newTypeCell = newTransactionRow.insertCell(1)
    newTypeCell.textContent = transactionObj['transactionDescription']

    newTypeCell = newTransactionRow.insertCell(2)
    newTypeCell.textContent = transactionObj['transactionAmount']

    newTypeCell = newTransactionRow.insertCell(3)
    newTypeCell.textContent = transactionObj['transactionCategory']

    let newDeleteCell = newTransactionRow.insertCell(4)
    let deleteButton = document.createElement('button')
    deleteButton.textContent = 'Eliminar'
    newDeleteCell.appendChild(deleteButton)

    deleteButton.addEventListener('click', (event) => {
        let transactionRow = event.target.parentNode.parentNode
        let transactionId = transactionRow.getAttribute('data-transaction-id')
        console.log(transactionId)
        transactionRow.remove()
        deleteTransactionObj(transactionId)
    })
}