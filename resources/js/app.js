import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
import moment from 'moment'


const addToOrder = document.querySelectorAll('.add-to-order')
let orderCounter = document.querySelector('#orderCounter');

function updateOrder(tracking) {
    axios.post('/update-order', tracking).then(res => {
        orderCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item added to order',
            progressBar: false
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something went wrong',
            progressBar: false
        }).show();
    })
}

addToOrder.forEach((btn) => {
    btn.addEventListener('click', (e) =>{
        const tracking = JSON.parse(btn.dataset.tracking)
        updateOrder(tracking)
        
    })
})

// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}


// Change purchase status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let purchase = hiddenInput ? hiddenInput.value : null
purchase = JSON.parse(purchase)
let time = document.createElement('small')

function updateStatus(purchase) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if (stepCompleted) {
            status.classList.add('step-completed')
        }
        if (dataProp === purchase.status) {
            stepCompleted = false
            time.innerText = moment(purchase.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    })
}

updateStatus(purchase);

// Socket
let socket = io()
initAdmin(socket)

// Join
if (purchase) {
    socket.emit('join', `purchase_${purchase._id}`)
}
let adminAreaPath = window.location.pathname
if (adminAreaPath.includes('admin')) {
    // initAdmin(socket)
    socket.emit('join', 'adminRoom')
}


socket.on('purchaseUpdated', (data) => {
    const updatedPurchase = { ...purchase }
    updatedPurchase.updatedAt = moment().format()
    updatedPurchase.status = data.status
    // console.log(data)
    updateStatus(updatedPurchase)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Purchase updated',
        progressBar: false,
    }).show();
})