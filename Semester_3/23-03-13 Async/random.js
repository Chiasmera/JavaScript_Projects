
function createNode(element) {
  return document.createElement(element)
}

function append(parent, element) {
  return parent.appendChild(element)
}
const ul = document.getElementById('users')
const url = "https://randomuser.me/api/?results=100&nat=dk"

fetch(url)
.then(result=>result.json())
.then(json => {
  const users = json.results
  return users.map(user => {
    const li = createNode('li'),
    img = createNode('img'),
    span = createNode('span')
  img.src = user.picture.large
  span.innerHTML = `${user.name.first} ${user.name.last}`
  append(li, img)
  append(li, span)
  append(ul, li)
  })
})
.catch(error => console.log(JSON.stringify(error)))
