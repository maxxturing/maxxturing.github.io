// Submits the contact form to Web3Forms via fetch and shows an inline
// thank-you message instead of redirecting away from the page.
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('form');
  if (!form) return;

  var button = document.getElementById('send');
  var thankyou = document.getElementById('thankyou_message');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (button) {
      button.disabled = true;
      button.innerHTML = 'Sending…';
    }

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (data.success) {
          form.style.display = 'none';
          if (thankyou) thankyou.style.display = 'block';
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      })
      .catch(function () {
        if (button) {
          button.disabled = false;
          button.innerHTML = 'Send';
        }
        alert('Sorry, something went wrong. Please email maxx@maxxturing.com directly.');
      });
  });
});
