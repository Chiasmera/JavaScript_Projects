const isMomHappy = true

//Promise
const WillIGetNewPhone = new Promise(
  (resolve, reject) => {
    if (isMomHappy) {
      const phone = {
        brand: 'Samsung',
        color: 'Black'
      }
      resolve(phone)
    } else {
      const reason = new Error('Mom is not happy')
      reject(reason)
    }
  }
)

const showOff = function (phone) {
  const message = `Hey. Se min nye ${phone.color} ${phone.brand}`
  return Promise.resolve(message)
}

const askMom = function () {
  WillIGetNewPhone
  .then(showOff)
  .then(message => console.log(message))
  .catch(error => console.log(error.message))
};

askMom()