document.addEventListener('DOMContentLoaded', function() {
    // Dropdown
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        dropdown.addEventListener('mouseenter', () => {
            dropdownContent.style.display = 'grid';
        });
        dropdown.addEventListener('mouseleave', () => {
            dropdownContent.style.display = 'none';
        });
    

    // Seleciona a seção que contém os produtos
    const productsGrid = document.querySelector('.products-grid');
    // Obtém todos os produtos como um array
    const products = Array.from(productsGrid.children);
    
    // Função para embaralhar os produtos
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    
    // Embaralha e adiciona novamente os produtos na grid
    shuffle(products).forEach(product => productsGrid.appendChild(product));
  });

    // Animações de entrada

    const elements = document.querySelectorAll('.home-content, section h2, section p:not(.price):not(.product-card p)');
    elements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
    });

    const revealElements = () => {
        document.getElementById('searchInput').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchProducts();
            }
        });
        const triggerBottom = window.innerHeight * 0.8;
        elements.forEach(el => {
            const boxTop = el.getBoundingClientRect().top;
            if (boxTop < triggerBottom) {
                el.style.opacity = 1;
                el.style.transform = 'translateY(0)';
                el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            }
        });
    };

    window.addEventListener('scroll', revealElements);
    revealElements();

    // Filtragem dos produtos
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const loadMoreButton = document.getElementById('load-more');
    const loadLessButton = document.getElementById('load-less');
    const initialVisibleCount = 8;
    let visibleCount = initialVisibleCount;

    let isManualClick = false;

    const showProducts = (count, filter = 'all') => {
        let totalVisible = 0;
        let totalFiltered = 0;
    
        // Divide os filtros múltiplos em uma lista
        const filterList = filter.split(',');
    
        productCards.forEach((card, index) => {
            const matchesFilter = filter === 'all' || filterList.some(f => card.classList.contains(f));
            if (matchesFilter) {
                totalFiltered++;
                card.style.display = totalVisible < count ? 'block' : 'none';
                if (totalVisible < count) {
                    totalVisible++;
                }
            } else {
                card.style.display = 'none';
            }
        });
    
        loadMoreButton.style.display = (totalFiltered > visibleCount) ? 'block' : 'none';
        loadLessButton.style.display = (visibleCount > initialVisibleCount) ? 'block' : 'none';
    };
    

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            isManualClick = true;
            const filter = button.getAttribute('data-filter');
            visibleCount = initialVisibleCount;
            
            // Chamando showProducts com o filtro selecionado
            showProducts(visibleCount, filter);
    
            // Calcula o total de produtos filtrados com base nos múltiplos filtros
            const totalFiltered = Array.from(productCards).filter(card => {
                return filter === 'all' || filter.split(',').some(subfilter => card.classList.contains(subfilter));
            }).length;
    
            // Atualiza a exibição dos botões "Exibir Mais" e "Exibir Menos"
            loadMoreButton.style.display = (totalFiltered > visibleCount) ? 'block' : 'none';
            loadLessButton.style.display = (visibleCount > initialVisibleCount) ? 'block' : 'none';
    
            // Define a classe ativa para o botão selecionado
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
    
            // Rola até os produtos se o clique for manual
            if (isManualClick) {
                scrollToProducts();    
    
            }
        });

        const whatsappButtons = document.querySelectorAll('.whatsapp-product-button');
        whatsappButtons.forEach(button => {
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('h3').innerText;

            button.setAttribute('data-product-name', productName);

            button.addEventListener('click', (event) => {
                event.preventDefault();
                const productName = button.getAttribute('data-product-name');
                const phoneNumber = '5544999231237';
                const message = `Olá, estou interessado em comprar ${productName}`;
                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
                window.open(whatsappUrl, '_blank');
            });
        });
    });

    loadMoreButton.addEventListener('click', () => {
        visibleCount += 8;
        const currentFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        
        showProducts(visibleCount, currentFilter);
        
        const totalFiltered = Array.from(productCards).filter(card => {
            return currentFilter === 'all' || currentFilter.split(',').some(subfilter => card.classList.contains(subfilter));
        }).length;
        
        if (visibleCount >= totalFiltered) {
            loadMoreButton.style.display = 'none';
        }
        loadLessButton.style.display = 'block';
    });
    

    loadLessButton.addEventListener('click', () => {
        visibleCount = initialVisibleCount;
        const currentFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        showProducts(visibleCount, currentFilter);
    
        loadMoreButton.style.display = 'block';
        loadLessButton.style.display = 'none';
    });
    

    showProducts(visibleCount);
    isManualClick = false;
});

function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

window.addEventListener('load', () => {
    // A rolagem não ocorre aqui
});

const searchInput = document.getElementById('searchInput');
const suggestionsContainer = document.getElementById('suggestions');
const productCards = document.querySelectorAll('.product-card');
const productNames = Array.from(productCards).map(card => card.querySelector('h3').innerText);

searchInput.addEventListener('input', function() {
    const query = searchInput.value.toLowerCase();
    suggestionsContainer.innerHTML = '';
    if (query) {
        const suggestions = productNames.filter(name => name.toLowerCase().includes(query));
        suggestions.forEach(suggestion => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.innerText = suggestion;
            suggestionsContainer.appendChild(suggestionItem);

            suggestionItem.addEventListener('click', function() {
                searchInput.value = suggestion;
                suggestionsContainer.innerHTML = '';
                searchProducts();
            });
        });
    }
});

window.searchProducts = function() {
    const input = searchInput.value.toLowerCase();
    let firstVisibleProduct = null;

    productCards.forEach(card => {
        const productName = card.querySelector('h3').innerText.toLowerCase();
        if (productName.includes(input)) {
            card.style.display = 'block';
            if (!firstVisibleProduct) {
                firstVisibleProduct = card;
            }
        } else {
            card.style.display = 'none';
        }
    });

    if (firstVisibleProduct) {
        firstVisibleProduct.scrollIntoView({ behavior: 'smooth' });
    }
};


