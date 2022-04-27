import axios from 'axios'
import moment from 'moment'
import Noty from 'noty'



export function initAdmin(socket) {
    const purchaseTableBody = document.querySelector('#purchaseTableBody')
    let purchases = []
    let markup

    axios.get('/admin/purchases', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        purchases = res.data
        markup = generateMarkup(purchases)
        purchaseTableBody.innerHTML = markup
    }).catch(err => {
        console.log(err);
    })

    function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((listItem) => {
            return `
                <p>${listItem.item.name} - ${listItem.qty} pcs </p>
            `
        }).join('')
    }
    

    function generateMarkup(purchases) {
        return purchases.map(purchase => {
            return `
                <tr>
                <td class="border px-4 py-2 text-green-900">
                    <p>${purchase._id}</p>
                    <div>${renderItems(purchase.items)}</div>
                </td>
                <td class="border px-4 py-2">${purchase.prodmanagerId.name}</td>
                <td class="border px-4 py-2">${purchase.customername}</td>
                <td class="border px-4 py-2">${purchase.address}</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/purchase/status" method="POST">
                            <input type="hidden" name="purchaseId" value="${purchase._id}">
                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="purchase_placed"
                                    ${purchase.status === 'purchase_placed' ? 'selected' : ''}>
                                    Placed</option>
                                <option value="confirmed" ${purchase.status === 'confirmed' ? 'selected' : ''}>
                                    Confirmed</option>
                                <option value="prepared" ${purchase.status === 'prepared' ? 'selected' : ''}>
                                    Prepared</option>
                                <option value="delivered" ${purchase.status === 'delivered' ? 'selected' : ''}>
                                    Delivered
                                </option>
                                <option value="completed" ${purchase.status === 'completed' ? 'selected' : ''}>
                                    Completed
                                </option>
                            </select>
                        </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">
                    ${moment(purchase.createdAt).format('hh:mm A')}
                </td>
                
            </tr>
        `
        }).join('')
    }
    // Socket
    // let socket = io()
     socket.on('purchasePlaced', (purchase) => {
         new Noty({
             type: 'success',
             timeout: 1000,
             text: 'New purchase!',
             progressBar: false,
         }).show();
         purchases.unshift(purchase)
        purchaseTableBody.innerHTML = ''
         purchaseTableBody.innerHTML = generateMarkup(purchases)
     })
}





