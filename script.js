const coverWrapper = document.getElementById('coverWrapper');
const coverButton = document.getElementById('coverButton');
const coverInput = document.getElementById('coverInput');
const avatarButton = document.getElementById('avatarButton');
const avatarInput = document.getElementById('avatarInput');
const avatarImage = document.getElementById('avatarImage');

coverButton.addEventListener('click', () => coverInput.click());
avatarButton.addEventListener('click', () => avatarInput.click());

function previewImage(file, callback) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

coverInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  previewImage(file, (src) => {
    coverWrapper.style.backgroundImage = `url(${src})`;
  });
});

avatarInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  previewImage(file, (src) => {
    avatarImage.src = src;
  });
});
