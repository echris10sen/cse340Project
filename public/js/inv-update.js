const form = document.querySelector('#updateForm');
form.addEventListener('change', function() {
    console.log('Form has changed');
    const updateBtn = document.querySelector('button')
    updateBtn.removeAttribute('disabled')
})