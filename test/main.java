// Пример для будущей фильтрации/поиска
document.querySelector('.search-block button').addEventListener('click', () => {
    const query = document.querySelector('.search-block input').value.toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
        const text = card.querySelector('h4').textContent.toLowerCase();
        card.style.display = text.includes(query) ? '' : 'none';
    });
});
