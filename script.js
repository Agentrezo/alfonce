// Enhanced storage with improved persistence and error handling
const storage = {
    _memoryStore: {},
    setItem(key, value) {
        try {
            // Store in memory variable
            this._memoryStore[key] = JSON.stringify(value);
            
            // Try localStorage for persistence across reloads
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(key, JSON.stringify(value));
                    console.log(Data saved to localStorage: ${key});
                }
            } catch (e) {
                console.error('Error storing in localStorage:', e);
            }
        } catch (e) {
            console.error('Error storing data:', e);
            // Show error notification
            showNotification('Error saving data. Please try again.', 'error');
        }
    },
    getItem(key) {
        try {
            // Try to get from localStorage first for persistence
            let data = null;
            try {
                if (typeof localStorage !== 'undefined') {
                    data = localStorage.getItem(key);
                    if (data) {
                        return JSON.parse(data);
                    }
                }
            } catch (e) {
                console.error('Error retrieving from localStorage:', e);
            }
            
            // Fallback to memory storage
            return this._memoryStore[key] ? JSON.parse(this._memoryStore[key]) : null;
        } catch (e) {
            console.error('Error retrieving data:', e);
            return null;
        }
    },
    removeItem(key) {
        delete this._memoryStore[key];
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(key);
                console.log(Data removed from localStorage: ${key});
            }
        } catch (e) {
            console.error('Error removing from localStorage:', e);
        }
    }
};

// Function to show notifications for success/error messages
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = notification-toast ${type === 'error' ? 'notification-error' : 'notification-success'};
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Generate a session ID for this browser session to track user reactions and orders
if (!storage.getItem('sessionId')) {
    storage.setItem('sessionId', 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9));
}

// Get the current user's session ID
function getCurrentUserId() {
    return storage.getItem('sessionId');
}

// Initialize default data if not exists
function initializeDefaultData() {
    // Admin credentials
    if (!storage.getItem('adminCredentials')) {
        storage.setItem('adminCredentials', {
            username: 'Astra',
            password: '@Astra123'
        });
    }
    
    // Owner password
    if (!storage.getItem('ownerPassword')) {
        storage.setItem('ownerPassword', 'owner123');
    }
    
    // Slideshow text
    if (!storage.getItem('slideshowText')) {
        storage.setItem('slideshowText', 'Best university products and services in UDOM');
    }
    
    // Individual slideshow images
    for (let i = 0; i < 7; i++) {
        const slideKey = slideshowImage${i};
        if (!storage.getItem(slideKey) && i < 3) {
            // Set default images for first 3 slides
            storage.setItem(slideKey, {
                url: https://picsum.photos/id/${i+1}/800/400,
                id: slide${i}
            });
        }
    }
    
    // Service images (placeholder data)
    const serviceCategories = ['drawing-boards', 'mathematical-set', 'routers', 'sim-cards', 'sme-bundles', 'papers'];
    serviceCategories.forEach(category => {
        if (!storage.getItem(${category}Images)) {
            // Generate 5 placeholder images for each service
            const images = [];
            for (let i = 1; i <= 5; i++) {
                const seed = serviceCategories.indexOf(category) * 10 + i;
                images.push({
                    url: https://picsum.photos/id/${seed + 30}/450/450,
                    id: ${category}-${i}
                });
            }
            storage.setItem(${category}Images, images);
        }
    });
    
    // Notifications
    if (!storage.getItem('notifications')) {
        storage.setItem('notifications', [
            {
                id: 'notif1',
                message: 'Welcome to ALFONCE SERVICES! We offer a wide range of university products and services.',
                timestamp: new Date().toISOString(),
                comments: [],
                reactions: {},
                userReactions: {} // Track which users have reacted
            }
        ]);
    }
    
    // Orders
    if (!storage.getItem('orders')) {
        storage.setItem('orders', []);
    }
    
    // Other services
    if (!storage.getItem('otherServices')) {
        storage.setItem('otherServices', [
            {
                id: 'service1',
                title: 'Custom Printing Services',
                description: 'We offer custom printing services for all your academic needs.',
                mediaType: 'image',
                mediaUrl: 'https://picsum.photos/id/60/800/450',
                timestamp: new Date().toISOString(),
                reactions: {},
                userReactions: {},
                comments: [],
                items: '▪Printing\n▪Scanning\n▪Photocopying\n▪Binding',
                showOnMainPage: false
            }
        ]);
    }
    
    // Developer code
    if (!storage.getItem('developerCode')) {
        storage.setItem('developerCode', '<h1>Welcome to ALFONCE SERVICES</h1>\n<p>This is a sample HTML code.</p>');
    }
}

// Initialize tabs functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to selected tab and content
            tab.classList.add('active');
            document.getElementById(${tabName}-content).classList.add('active');
            
            // Hide mobile menu after selection on mobile view
            if (window.innerWidth <= 768) {
                document.querySelector('.submenu').classList.remove('active');
            }
            
            // Load specific content based on tab
            if (tabName === 'notifications') {
                loadNotifications();
            } else if (tabName === 'orders') {
                loadOrders();
            } else if (tabName === 'other-services') {
                loadOtherServices();
            } else if (tabName === 'developer') {
                initializeDeveloperTab();
            }
        });
    });
    
    // Mobile menu button
    document.querySelector('.mobile-menu-button').addEventListener('click', () => {
        document.querySelector('.submenu').classList.toggle('active');
    });
}

// Initialize developer tab functionality
function initializeDeveloperTab() {
    // Initialize developer slideshow
    initializeDeveloperSlideshow();
    
    // Initialize developer modal
    const developerBtn = document.getElementById('developerBtn');
    const developerModal = document.getElementById('developerModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const romanticMusic = document.getElementById('romanticMusic');
    
    developerBtn.addEventListener('click', () => {
        developerModal.classList.remove('hidden');
        developerModal.classList.add('flex');
        romanticMusic.play().catch(err => {
            console.log('Audio play failed:', err);
        });
    });
    
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            developerModal.classList.add('hidden');
            developerModal.classList.remove('flex');
            romanticMusic.pause();
            romanticMusic.currentTime = 0;
        });
    });
}

// Initialize developer slideshow
function initializeDeveloperSlideshow() {
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slideshow-image');
    
    function showSlides() {
        for (let i = 0; i < slides.length; i++) {
            slides[i].classList.remove('active');
        }
        
        slideIndex++;
        if (slideIndex > slides.length) {
            slideIndex = 1;
        }
        
        slides[slideIndex - 1].classList.add('active');
        setTimeout(showSlides, 3000); // Change image every 3 seconds
    }
    
    if (slides.length > 0) {
        showSlides();
    }
}

// Initialize slideshow
function initializeSlideshow() {
    const slidesContainer = document.querySelector('.slides');
    const slideshowText = storage.getItem('slideshowText') || 'Best university products and services in UDOM';
    
    // Set slideshow text
    document.querySelector('.slide-text').textContent = slideshowText;
    
    // Clear existing slides
    slidesContainer.innerHTML = '';
    
    // Get individual slideshow images
    const slideshowImages = [];
    for (let i = 0; i < 7; i++) {
        const slideKey = slideshowImage${i};
        const slideImage = storage.getItem(slideKey);
        if (slideImage) {
            slideshowImages.push(slideImage);
        }
    }
    
    // Add slides
    slideshowImages.forEach(image => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.style.backgroundImage = url(${image.url});
        slidesContainer.appendChild(slide);
    });
    
    // If no slides, add a default one
    if (slideshowImages.length === 0) {
        const defaultSlide = document.createElement('div');
        defaultSlide.className = 'slide';
        defaultSlide.style.backgroundImage = 'url(https://picsum.photos/id/1/800/400)';
        slidesContainer.appendChild(defaultSlide);
    }
    
    // Automatic slideshow
    let slideIndex = 0;
    
    function showSlides() {
        const slides = document.querySelectorAll('.slide');
        if (slides.length === 0) return;
        
        slideIndex++;
        if (slideIndex >= slides.length) {
            slideIndex = 0;
        }
        
        slidesContainer.style.transform = translateX(-${slideIndex * 100}%);
        setTimeout(showSlides, 5000);
    }
    
    showSlides();
}

// Initialize service slideshows
function initializeServiceSlideshows() {
    const serviceCategories = ['drawing-boards', 'mathematical-set', 'routers', 'sim-cards', 'sme-bundles', 'papers'];
    
    serviceCategories.forEach(category => {
        const images = storage.getItem(${category}Images) || [];
        const slidesContainer = document.querySelector(.service-slides[data-service="${category}"]);
        
        // Clear existing slides
        slidesContainer.innerHTML = '';
        
        // Add slides
        images.forEach(image => {
            const slide = document.createElement('div');
            slide.className = 'service-slide';
            slide.style.backgroundImage = url(${image.url});
            slidesContainer.appendChild(slide);
        });
        
        // If no slides, add a default one
        if (images.length === 0) {
            const defaultSlide = document.createElement('div');
            defaultSlide.className = 'service-slide';
            defaultSlide.style.backgroundImage = url(https://picsum.photos/id/${serviceCategories.indexOf(category) + 40}/450/450);
            slidesContainer.appendChild(defaultSlide);
        }
        
        // Automatic slideshow
        let slideIndex = 0;
        
        function showSlides() {
            const slides = slidesContainer.querySelectorAll('.service-slide');
            if (slides.length === 0) return;
            
            slideIndex++;
            if (slideIndex >= slides.length) {
                slideIndex = 0;
            }
            
            slidesContainer.style.transform = translateX(-${slideIndex * 100}%);
            setTimeout(showSlides, 4000);
        }
        
        showSlides();
    });
}

// Load custom services to main page
function loadCustomServicesToMainPage() {
    const services = storage.getItem('otherServices') || [];
    const container = document.getElementById('custom-services-container');
    
    // Clear existing content
    container.innerHTML = '';
    
    // Filter services that should be shown on main page
    const mainPageServices = services.filter(service => service.showOnMainPage);
    
    // Add custom services to main page
    mainPageServices.forEach(service => {
        const serviceContainer = document.createElement('div');
        serviceContainer.className = 'service-container';
        
        // Create service image part
        const serviceImage = document.createElement('div');
        serviceImage.className = 'service-image';
        
        const serviceSlides = document.createElement('div');
        serviceSlides.className = 'service-slides';
        serviceSlides.setAttribute('data-service', custom-${service.id});
        
        const slide = document.createElement('div');
        slide.className = 'service-slide';
        
        if (service.mediaType === 'image') {
            slide.style.backgroundImage = url(${service.mediaUrl});
        } else {
            // Create a fallback image for video services
            slide.style.backgroundImage = 'url(https://picsum.photos/id/42/450/450)';
        }
        
        serviceSlides.appendChild(slide);
        serviceImage.appendChild(serviceSlides);
        
        // Create service content part
        const serviceContent = document.createElement('div');
        serviceContent.className = 'service-content';
        
        const serviceTitle = document.createElement('div');
        serviceTitle.className = 'service-title';
        serviceTitle.textContent = service.title;
        
        const serviceItems = document.createElement('div');
        serviceItems.className = 'service-items';
        serviceItems.innerHTML = service.items ? service.items.replace(/\n/g, '<br>') : service.description;
        
        const serviceButton = document.createElement('div');
        serviceButton.className = 'service-button';
        serviceButton.textContent = 'SELECT';
        serviceButton.addEventListener('click', () => {
            openOtherServiceOrderForm(service.id);
        });
        
        serviceContent.appendChild(serviceTitle);
        serviceContent.appendChild(serviceItems);
        serviceContent.appendChild(serviceButton);
        
        // Combine image and content
        serviceContainer.appendChild(serviceImage);
        serviceContainer.appendChild(serviceContent);
        
        // Add to container
        container.appendChild(serviceContainer);
    });
}

// Load notifications
function loadNotifications() {
    const notifications = storage.getItem('notifications') || [];
    const container = document.querySelector('.notifications-container');
    const sessionId = storage.getItem('sessionId');
    
    // Clear existing content
    container.innerHTML = '';
    
    if (notifications.length === 0) {
        container.innerHTML = '<p class="text-center py-4">No notifications yet.</p>';
        return;
    }
    
    // Add notifications
    notifications.forEach(notification => {
        const date = new Date(notification.timestamp);
        const formattedDate = ${date.toLocaleDateString()} ${date.toLocaleTimeString()};
        
        const notificationEl = document.createElement('div');
        notificationEl.className = 'notification-item';
        notificationEl.dataset.id = notification.id;
        
        // Initialize user reactions if not present
        if (!notification.userReactions) {
            notification.userReactions = {};
        }
        
        let reactionButtons = '';
        const reactions = ['❤', '👍', '👎', '🤝', '😱', '🌹', '💯', '💪', '🙌', '🔥'];
        
        // Check if user has already reacted
        const userReaction = notification.userReactions[sessionId];
        
        reactions.forEach(reaction => {
            const count = notification.reactions[reaction] || 0;
            const isSelected = userReaction === reaction;
            reactionButtons += `
                <button class="reaction-button ${isSelected ? 'selected' : ''}" 
                        data-reaction="${reaction}" 
                        data-notification-id="${notification.id}">
                    ${reaction} <span class="reaction-count">${count}</span>
                </button>
            `;
        });
        
        // Create comments HTML
        let commentsHtml = '';
        if (notification.comments && notification.comments.length > 0) {
            commentsHtml = '<div class="comment-list">';
            notification.comments.forEach(comment => {
                commentsHtml += `
                    <div class="comment-item">
                        <span class="comment-author">${comment.name}:</span>
                        <span>${comment.text}</span>
                    </div>
                `;
            });
            commentsHtml += '</div>';
        }
        
        notificationEl.innerHTML = `
            <p class="mb-2">${notification.message}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">${formattedDate}</p>
            <div class="reaction-buttons">${reactionButtons}</div>
            <div class="comment-section">
                ${commentsHtml}
                <button class="comment-button mt-2" data-notification-id="${notification.id}">
                    Add Comment
                </button>
            </div>
        `;
        
        container.appendChild(notificationEl);
    });
    
    // Add event listeners for reactions
    document.querySelectorAll('.reaction-button').forEach(button => {
        button.addEventListener('click', function() {
            const notificationId = this.getAttribute('data-notification-id');
            const reaction = this.getAttribute('data-reaction');
            addReaction(notificationId, reaction, 'notification');
        });
    });
    
    // Add event listeners for comments
    document.querySelectorAll('.comment-button').forEach(button => {
        button.addEventListener('click', function() {
            const notificationId = this.getAttribute('data-notification-id');
            openCommentModal(notificationId, 'notification');
        });
    });
}

// Add reaction
function addReaction(itemId, reaction, type) {
    let items;
    const sessionId = storage.getItem('sessionId');
    
    if (type === 'notification') {
        items = storage.getItem('notifications') || [];
    } else if (type === 'service') {
        items = storage.getItem('otherServices') || [];
    }
    
    const itemIndex = items.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        const item = items[itemIndex];
        
        if (!item.reactions) {
            item.reactions = {};
        }
        
        if (!item.userReactions) {
            item.userReactions = {};
        }
        
        // If user already reacted, remove previous reaction
        const previousReaction = item.userReactions[sessionId];
        if (previousReaction) {
            if (item.reactions[previousReaction] > 0) {
                item.reactions[previousReaction]--;
            }
        }
        
        // Add new reaction
        if (!item.reactions[reaction]) {
            item.reactions[reaction] = 0;
        }
        
        item.reactions[reaction]++;
        
        // Store which reaction this user has made
        item.userReactions[sessionId] = reaction;
        
        items[itemIndex] = item;
        
        if (type === 'notification') {
            storage.setItem('notifications', items);
            loadNotifications();
            showNotification('Reaction added!', 'success');
        } else if (type === 'service') {
            storage.setItem('otherServices', items);
            loadOtherServices();
            showNotification('Reaction added!', 'success');
        }
    }
}

// Open comment modal
function openCommentModal(itemId, type) {
    const modal = document.getElementById('comment-modal');
    const submitButton = document.getElementById('submit-comment');
    
    // Store item info on the button for later use
    submitButton.setAttribute('data-item-id', itemId);
    submitButton.setAttribute('data-item-type', type);
    
    // Clear previous inputs
    document.getElementById('commenter-name').value = '';
    document.getElementById('comment-text').value = '';
    
    // Show modal
    modal.style.display = 'block';
    
    // Set up submit event
    submitButton.onclick = function() {
        const name = document.getElementById('commenter-name').value.trim();
        const text = document.getElementById('comment-text').value.trim();
        
        if (name && text) {
            addComment(itemId, name, text, type);
            closeModal('comment-modal');
            showNotification('Comment added successfully!', 'success');
        } else {
            // Show validation modal
            document.getElementById('validation-modal').style.display = 'block';
        }
    };
}

// Add comment
function addComment(itemId, name, text, type) {
    let items;
    
    if (type === 'notification') {
        items = storage.getItem('notifications') || [];
    } else if (type === 'service') {
        items = storage.getItem('otherServices') || [];
    }
    
    const itemIndex = items.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        const item = items[itemIndex];
        
        if (!item.comments) {
            item.comments = [];
        }
        
        item.comments.push({
            name: name,
            text: text,
            timestamp: new Date().toISOString()
        });
        
        items[itemIndex] = item;
        
        if (type === 'notification') {
            storage.setItem('notifications', items);
            loadNotifications();
        } else if (type === 'service') {
            storage.setItem('otherServices', items);
            loadOtherServices();
        }
    }
}

// Load orders
function loadOrders() {
    const allOrders = storage.getItem('orders') || [];
    const currentUserId = getCurrentUserId();
    
    // Filter orders to only show the ones submitted by the current user
    const userOrders = allOrders.filter(order => order.userId === currentUserId);
    
    const container = document.querySelector('.orders-container');
    
    // Clear existing content
    container.innerHTML = '';
    
    if (userOrders.length === 0) {
        container.innerHTML = '<p class="text-center py-4">No orders submitted yet.</p>';
        return;
    }
    
    // Add orders
    userOrders.forEach(order => {
        const date = new Date(order.timestamp);
        const formattedDate = ${date.toLocaleDateString()} ${date.toLocaleTimeString()};
        
        const orderEl = document.createElement('div');
        orderEl.className = 'order-item';
        orderEl.dataset.id = order.id;
        
        let locationDetails = '';
        if (order.location === 'Udom') {
            locationDetails = `
                <p><strong>College/School/Institute:</strong> ${order.college || 'N/A'}</p>
                <p><strong>Block Number:</strong> ${order.blockNumber || 'N/A'}</p>
                <p><strong>Room Number:</strong> ${order.roomNumber || 'N/A'}</p>
            `;
        } else {
            locationDetails = <p><strong>Location Details:</strong> ${order.otherLocation || 'N/A'}</p>;
        }
        
        // Add geolocation if available
        let geoLocationHtml = '';
        if (order.latitude && order.longitude) {
            geoLocationHtml = `
                <p class="mt-2"><strong>GPS Location:</strong></p>
                <p>Latitude: ${order.latitude}</p>
                <p>Longitude: ${order.longitude}</p>
                <a href="https://maps.google.com/?q=${order.latitude},${order.longitude}" target="_blank" class="text-blue-500 underline">View on Google Maps</a>
            `;
        }
        
        orderEl.innerHTML = `
            <h3 class="text-lg font-bold mb-2">${order.service}</h3>
            <p><strong>Name:</strong> ${order.name}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Location:</strong> ${order.location}</p>
            ${locationDetails}
            ${order.amount ? <p><strong>Amount:</strong> ${order.amount}</p> : ''}
            ${geoLocationHtml}
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">${formattedDate}</p>
            <button class="delete-button" data-id="${order.id}">Delete</button>
        `;
        
        container.appendChild(orderEl);
    });
    
    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            deleteOrder(orderId);
        });
    });
}

// Delete order
function deleteOrder(orderId) {
    const orders = storage.getItem('orders') || [];
    const updatedOrders = orders.filter(order => order.id !== orderId);
    storage.setItem('orders', updatedOrders);
    loadOrders();
    showNotification('Order deleted successfully', 'success');
}

// Load other services
function loadOtherServices() {
    const services = storage.getItem('otherServices') || [];
    const container = document.querySelector('.other-services-container');
    const sessionId = storage.getItem('sessionId');
    
    // Clear existing content
    container.innerHTML = '';
    
    if (services.length === 0) {
        container.innerHTML = '<p class="text-center py-4">No additional services available yet.</p>';
        return;
    }
    
    // Add services
    services.forEach(service => {
        const date = new Date(service.timestamp);
        const formattedDate = ${date.toLocaleDateString()} ${date.toLocaleTimeString()};
        
        const serviceEl = document.createElement('div');
        serviceEl.className = 'service-item';
        serviceEl.dataset.id = service.id;
        
        let mediaHtml = '';
        if (service.mediaType === 'image') {
            mediaHtml = <img src="${service.mediaUrl}" alt="${service.title}" class="w-full h-auto rounded mb-3">;
        } else if (service.mediaType === 'video') {
            mediaHtml = <video src="${service.mediaUrl}" controls class="w-full h-auto rounded mb-3"></video>;
        }
        
        // Initialize user reactions if not present
        if (!service.userReactions) {
            service.userReactions = {};
        }
        
        let reactionButtons = '';
        const reactions = ['❤', '👍', '👎', '🤝', '😱', '🌹', '💯', '💪', '🙌', '🔥'];
        
        // Check if user has already reacted
        const userReaction = service.userReactions[sessionId];
        
        reactions.forEach(reaction => {
            const count = service.reactions?.[reaction] || 0;
            const isSelected = userReaction === reaction;
            reactionButtons += `
                <button class="reaction-button ${isSelected ? 'selected' : ''}" 
                        data-reaction="${reaction}" 
                        data-service-id="${service.id}">
                    ${reaction} <span class="reaction-count">${count}</span>
                </button>
            `;
        });
        
        // Create comments HTML
        let commentsHtml = '';
        if (service.comments && service.comments.length > 0) {
            commentsHtml = '<div class="comment-list">';
            service.comments.forEach(comment => {
                commentsHtml += `
                    <div class="comment-item">
                        <span class="comment-author">${comment.name}:</span>
                        <span>${comment.text}</span>
                    </div>
                `;
            });
            commentsHtml += '</div>';
        }
        
        // Format service items if available
        let serviceItemsHtml = '';
        if (service.items) {
            serviceItemsHtml = `
                <div class="service-items mb-3">
                    ${service.items.replace(/\n/g, '<br>')}
                </div>
            `;
        }
        
        serviceEl.innerHTML = `
            <h3 class="text-lg font-bold mb-2 p-2 bg-purple-600 text-white rounded">${service.title}</h3>
            ${mediaHtml}
            <p class="mb-3">${service.description}</p>
            ${serviceItemsHtml}
            <button class="service-button mb-3" data-service-id="${service.id}">SELECT</button>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">${formattedDate}</p>
            <div class="reaction-buttons">${reactionButtons}</div>
            <div class="comment-section">
                ${commentsHtml}
                <button class="comment-button mt-2" data-service-id="${service.id}">
                    Add Comment
                </button>
            </div>
        `;
        
        // Check if we're in admin mode to add delete button
        const adminCredentials = storage.getItem('adminCredentials');
        const currentUsername = storage.getItem('currentAdminUsername');
        const currentPassword = storage.getItem('currentAdminPassword');
        
        if (adminCredentials && currentUsername === adminCredentials.username && currentPassword === adminCredentials.password) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button mt-3';
            deleteButton.setAttribute('data-id', service.id);
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                deleteService(service.id);
            });
            
            serviceEl.appendChild(deleteButton);
        }
        
        container.appendChild(serviceEl);
    });
    
    // Add event listeners for reactions
    document.querySelectorAll('.service-item .reaction-button').forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service-id');
            const reaction = this.getAttribute('data-reaction');
            addReaction(serviceId, reaction, 'service');
        });
    });
    
    // Add event listeners for comments
    document.querySelectorAll('.service-item .comment-button').forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service-id');
            openCommentModal(serviceId, 'service');
        });
    });
    
    // Add event listeners for service SELECT buttons
    document.querySelectorAll('.service-item .service-button').forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service-id');
            openOtherServiceOrderForm(serviceId);
        });
    });
}

// Open other service order form
function openOtherServiceOrderForm(serviceId) {
    const services = storage.getItem('otherServices') || [];
    const service = services.find(s => s.id === serviceId);
    
    if (!service) return;
    
    // Set the title in the form
    document.getElementById('other-service-order-title').textContent = service.title;
    
    // Store service ID for submission
    document.getElementById('other-service-id').value = serviceId;
    
    // Clear form fields
    document.getElementById('other-service-full-name').value = '';
    document.getElementById('other-service-phone-number').value = '';
    document.getElementById('other-service-location').selectedIndex = 0;
    document.getElementById('other-service-college').value = '';
    document.getElementById('other-service-block-number').value = '';
    document.getElementById('other-service-room-number').value = '';
    document.getElementById('other-service-other-location-detail').value = '';
    document.getElementById('other-service-amount').value = '';
    
    // Hide additional location fields
    document.getElementById('other-service-udom-fields').classList.add('hidden');
    document.getElementById('other-service-other-location').classList.add('hidden');
    
    // Clear temporary location variables
    window.otherServiceTempLatitude = null;
    window.otherServiceTempLongitude = null;
    
    // Reset location status
    const locationStatus = document.getElementById('other-service-location-status');
    locationStatus.classList.add('hidden');
    
    // Reset location button
    const locationBtn = document.getElementById('other-service-share-location-btn');
    locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Share live Location';
    locationBtn.disabled = false;
    
    // Add click event for share location button
    document.getElementById('other-service-share-location-btn').onclick = shareOtherServiceLocation;
    
    // Show the modal
    document.getElementById('other-service-order-modal').style.display = 'block';
}

// Other service location changed
function otherServiceLocationChanged() {
    const location = document.getElementById('other-service-location').value;
    const udomFields = document.getElementById('other-service-udom-fields');
    const otherLocation = document.getElementById('other-service-other-location');
    
    if (location === 'Udom') {
        udomFields.classList.remove('hidden');
        otherLocation.classList.add('hidden');
    } else if (location === 'Other') {
        udomFields.classList.add('hidden');
        otherLocation.classList.remove('hidden');
    } else {
        udomFields.classList.add('hidden');
        otherLocation.classList.add('hidden');
    }
}

// Share location for other services with automatic detection
function shareOtherServiceLocation() {
    const locationBtn = document.getElementById('other-service-share-location-btn');
    const locationStatus = document.getElementById('other-service-location-status');
    
    // Change button text and add loader
    locationBtn.innerHTML = '<span class="location-loader mr-2"></span> Detecting location...';
    locationBtn.disabled = true;
    
    // Show status loading message
    locationStatus.classList.remove('hidden');
    locationStatus.textContent = 'Requesting location...';
    locationStatus.className = 'mt-2 text-sm text-gray-600';
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Store the location immediately
                window.otherServiceTempLatitude = position.coords.latitude;
                window.otherServiceTempLongitude = position.coords.longitude;
                
                // Wait for 2 seconds to simulate loading and give visual feedback
                setTimeout(() => {
                    // Update button text and re-enable
                    locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Location Detected';
                    locationBtn.disabled = false;
                    locationBtn.style.backgroundColor = '#28a745'; // Green color to indicate success
                    
                    // Show success message
                    locationStatus.textContent = 'Location detected successfully! Ready to share with order.';
                    locationStatus.className = 'mt-2 text-sm text-green-600 font-semibold';
                    
                    showNotification('Location detected successfully!', 'success');
                }, 2000);
            },
            (error) => {
                setTimeout(() => {
                    let errorMessage = 'Error getting location: ';
                    
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += 'Location permission denied.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += 'Location information unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMessage += 'Location request timed out.';
                            break;
                        default:
                            errorMessage += 'Unknown error occurred.';
                            break;
                    }
                    
                    // Reset button
                    locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Turn On Location';
                    locationBtn.disabled = false;
                    locationBtn.style.backgroundColor = ''; // Reset color
                    
                    // Show error
                    locationStatus.textContent = errorMessage;
                    locationStatus.className = 'mt-2 text-sm text-red-600';
                    
                    showNotification(errorMessage, 'error');
                }, 2000);
            },
            // Options with high accuracy and timeout
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        setTimeout(() => {
            // Reset button
            locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Turn On Location';
            locationBtn.disabled = false;
            locationBtn.style.backgroundColor = ''; // Reset color
            
            // Show error
            const errorMessage = 'Geolocation is not supported by this browser.';
            locationStatus.textContent = errorMessage;
            locationStatus.className = 'mt-2 text-sm text-red-600';
            
            showNotification(errorMessage, 'error');
        }, 2000);
    }
}

// Submit other service order
function submitOtherServiceOrder() {
    const name = document.getElementById('other-service-full-name').value.trim();
    const phone = document.getElementById('other-service-phone-number').value.trim();
    const location = document.getElementById('other-service-location').value;
    const serviceId = document.getElementById('other-service-id').value;
    const amount = document.getElementById('other-service-amount').value;
    
    // Get the service details
    const services = storage.getItem('otherServices') || [];
    const service = services.find(s => s.id === serviceId);
    
    if (!service) {
        showNotification('Service not found', 'error');
        return;
    }
    
    // Validate required fields
    if (!name || !phone || !location) {
        // Show the validation modal
        document.getElementById('validation-modal').style.display = 'block';
        return;
    }
    
    // Get location details based on location type
    let locationDetails = {};
    
    if (location === 'Udom') {
        locationDetails = {
            college: document.getElementById('other-service-college').value.trim(),
            blockNumber: document.getElementById('other-service-block-number').value.trim(),
            roomNumber: document.getElementById('other-service-room-number').value.trim()
        };
    } else if (location === 'Other') {
        locationDetails = {
            otherLocation: document.getElementById('other-service-other-location-detail').value.trim()
        };
    }
    
    // Get current user ID
    const userId = getCurrentUserId();
    
    // Create order object with geolocation if available
    const order = {
        id: order-${Date.now()},
        userId: userId, // Add user ID to order
        name: name,
        phone: phone,
        location: location,
        service: service.title,
        amount: amount,
        timestamp: new Date().toISOString(),
        ...locationDetails
    };
    
    // Add geolocation if available
    if (window.otherServiceTempLatitude && window.otherServiceTempLongitude) {
        order.latitude = window.otherServiceTempLatitude;
        order.longitude = window.otherServiceTempLongitude;
    }
    
    // Save order
    const orders = storage.getItem('orders') || [];
    orders.push(order);
    storage.setItem('orders', orders);
    
    // Auto navigate to the orders tab and reload orders
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Remove active class from all tabs and contents
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to orders tab and content
    document.querySelector('.tab[data-tab="orders"]').classList.add('active');
    document.getElementById('orders-content').classList.add('active');
    
    // Load orders
    loadOrders();
    
    // Prepare WhatsApp message
    let message = *New Order from ALFONCE SERVICES*\n\n;
    message += *Service:* ${service.title}\n;
    message += *Name:* ${name}\n;
    message += *Phone:* ${phone}\n;
    message += *Location:* ${location}\n;
    
    if (location === 'Udom') {
        message += *College/School/Institute:* ${locationDetails.college || 'N/A'}\n;
        message += *Block Number:* ${locationDetails.blockNumber || 'N/A'}\n;
        message += *Room Number:* ${locationDetails.roomNumber || 'N/A'}\n;
    } else {
        message += *Location Details:* ${locationDetails.otherLocation || 'N/A'}\n;
    }
    
    if (amount) {
        message += *Amount:* ${amount}\n;
    }
    
    // Add GPS location if available
    if (order.latitude && order.longitude) {
        message += \n*GPS Location:* https://maps.google.com/?q=${order.latitude},${order.longitude}\n;
    }
    
    // Open WhatsApp with the message
    const encodedMessage = encodeURIComponent(message);
    window.open(https://wa.me/255766839045?text=${encodedMessage}, '_blank');
    
    // Show success notification
    showNotification('Order submitted successfully!', 'success');
    
    // Close modal
    closeModal('other-service-order-modal');
}

// Delete service
function deleteService(serviceId) {
    const services = storage.getItem('otherServices') || [];
    const updatedServices = services.filter(service => service.id !== serviceId);
    storage.setItem('otherServices', updatedServices);
    loadOtherServices();
    
    // Also refresh the main page to remove any custom services
    loadCustomServicesToMainPage();
    
    showNotification('Service deleted successfully', 'success');
}

// Initialize admin panel
function initializeAdminPanel() {
    const adminLoginButton = document.getElementById('admin-login-button');
    const adminLoginError = document.getElementById('admin-login-error');
    const adminLogin = document.getElementById('admin-login');
    const adminDashboard = document.getElementById('admin-dashboard');
    
    adminLoginButton.addEventListener('click', () => {
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;
        const adminCredentials = storage.getItem('adminCredentials');
        
        if (username === adminCredentials.username && password === adminCredentials.password) {
            // Store current admin session
            storage.setItem('currentAdminUsername', username);
            storage.setItem('currentAdminPassword', password);
            
            adminLogin.classList.add('hidden');
            adminDashboard.classList.remove('hidden');
            
            // Load slideshow text
            document.getElementById('slideshow-text').value = storage.getItem('slideshowText') || '';
            
            // Load slideshow previews
            loadSlideshowPreviews();
            
            // Load service category previews
            loadServicePreviews();
            
            showNotification('Admin login successful!', 'success');
        } else {
            // Show password error modal instead of just text
            document.getElementById('password-modal').style.display = 'block';
        }
    });
    
    // Update slideshow text
    document.getElementById('update-slideshow-text').addEventListener('click', () => {
        const newText = document.getElementById('slideshow-text').value;
        storage.setItem('slideshowText', newText);
        document.querySelector('.slide-text').textContent = newText;
        showNotification('Slideshow text updated successfully!', 'success');
    });
    
    // Setup individual slideshow image uploads
    document.querySelectorAll('.slideshow-upload-btn').forEach(button => {
        button.addEventListener('click', function() {
            const container = this.closest('.slideshow-upload-item');
            const fileInput = container.querySelector('.slideshow-image-input');
            const index = fileInput.getAttribute('data-index');
            const files = fileInput.files;
            
            if (files.length === 0) {
                showNotification('Please select an image to upload.', 'error');
                return;
            }
            
            const file = files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const slideImage = {
                    url: e.target.result,
                    id: slide${index}
                };
                
                // Store in specific slideshow slot
                storage.setItem(slideshowImage${index}, slideImage);
                
                // Show preview
                const previewContainer = container.querySelector('.preview-container');
                const previewImage = container.querySelector('.preview-image');
                previewImage.src = e.target.result;
                previewContainer.classList.remove('hidden');
                
                showNotification('Slideshow image uploaded successfully!', 'success');
            };
            
            reader.readAsDataURL(file);
        });
    });
    
    // Apply all images to slideshow
    document.getElementById('apply-slideshow-images').addEventListener('click', () => {
        initializeSlideshow();
        showNotification('Slideshow images applied successfully!', 'success');
    });
    
    // Setup individual service category image uploads
    const serviceCategories = ['drawing-boards', 'mathematical-set', 'routers', 'sim-cards', 'sme-bundles', 'papers'];
    
    serviceCategories.forEach(category => {
        document.getElementById(upload-${category}).addEventListener('click', () => {
            const fileInput = document.getElementById(${category}-images);
            const files = fileInput.files;
            
            if (files.length === 0) {
                showNotification('Please select an image to upload.', 'error');
                return;
            }
            
            const file = files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Get existing images
                const images = storage.getItem(${category}Images) || [];
                
                // Add new image
                images.push({
                    url: e.target.result,
                    id: ${category}-${Date.now()}
                });
                
                // Limit to 5 images
                if (images.length > 5) {
                    images.shift(); // Remove oldest image
                }
                
                // Store updated images
                storage.setItem(${category}Images, images);
                
                // Refresh previews
                loadServiceCategoryPreview(category);
                
                // Update service slideshows
                initializeServiceSlideshows();
                
                showNotification(Image added to ${category.replace('-', ' ')}!, 'success');
            };
            
            reader.readAsDataURL(file);
        });
    });
    
    // Add other service
    document.getElementById('add-other-service').addEventListener('click', () => {
        const title = document.getElementById('other-service-title').value.trim();
        const description = document.getElementById('other-service-description').value.trim();
        const mediaFile = document.getElementById('other-service-media').files[0];
        const items = document.getElementById('other-service-items').value.trim();
        const showOnMainPage = document.getElementById('show-on-main-page').checked;
        
        if (!title || !description) {
            // Show validation modal
            document.getElementById('validation-modal').style.display = 'block';
            return;
        }
        
        if (!mediaFile) {
            // Show validation modal
            document.getElementById('validation-modal').style.display = 'block';
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const services = storage.getItem('otherServices') || [];
            
            services.push({
                id: service-${Date.now()},
                title: title,
                description: description,
                mediaType: mediaFile.type.startsWith('image/') ? 'image' : 'video',
                mediaUrl: e.target.result,
                timestamp: new Date().toISOString(),
                reactions: {},
                userReactions: {},
                comments: [],
                items: items,
                showOnMainPage: showOnMainPage
            });
            
            storage.setItem('otherServices', services);
            
            // Clear form
            document.getElementById('other-service-title').value = '';
            document.getElementById('other-service-description').value = '';
            document.getElementById('other-service-media').value = '';
            document.getElementById('other-service-items').value = '';
            document.getElementById('show-on-main-page').checked = false;
            
            // Refresh the main page if needed
            if (showOnMainPage) {
                loadCustomServicesToMainPage();
            }
            
            showNotification('Service added successfully!', 'success');
        };
        
        reader.readAsDataURL(mediaFile);
    });
    
    // Add notification
    document.getElementById('add-notification').addEventListener('click', () => {
        const message = document.getElementById('notification-message').value.trim();
        
        if (!message) {
            // Show validation modal
            document.getElementById('validation-modal').style.display = 'block';
            return;
        }
        
        const notifications = storage.getItem('notifications') || [];
        
        notifications.push({
            id: notif-${Date.now()},
            message: message,
            timestamp: new Date().toISOString(),
            reactions: {},
            userReactions: {},
            comments: []
        });
        
        storage.setItem('notifications', notifications);
        
        // Clear form
        document.getElementById('notification-message').value = '';
        
        showNotification('Notification added successfully!', 'success');
    });
}

// Load slideshow previews
function loadSlideshowPreviews() {
    for (let i = 0; i < 7; i++) {
        const slideKey = slideshowImage${i};
        const slideImage = storage.getItem(slideKey);
        
        if (slideImage) {
            const container = document.querySelector(.slideshow-image-input[data-index="${i}"]).closest('.slideshow-upload-item');
            const previewContainer = container.querySelector('.preview-container');
            const previewImage = container.querySelector('.preview-image');
            
            previewImage.src = slideImage.url;
            previewContainer.classList.remove('hidden');
        }
    }
}

// Load service previews
function loadServicePreviews() {
    const serviceCategories = ['drawing-boards', 'mathematical-set', 'routers', 'sim-cards', 'sme-bundles', 'papers'];
    
    serviceCategories.forEach(category => {
        loadServiceCategoryPreview(category);
    });
}

// Load service category preview
function loadServiceCategoryPreview(category) {
    const images = storage.getItem(${category}Images) || [];
    const previewContainer = document.getElementById(${category}-preview);
    
    // Clear existing previews
    previewContainer.innerHTML = '';
    
    // Add previews
    images.forEach((image, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'inline-block relative mr-2 mb-2';
        
        const img = document.createElement('img');
        img.src = image.url;
        img.className = 'w-16 h-16 object-cover rounded';
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs';
        deleteButton.innerHTML = '×';
        deleteButton.addEventListener('click', () => {
            images.splice(index, 1);
            storage.setItem(${category}Images, images);
            loadServiceCategoryPreview(category);
            initializeServiceSlideshows();
            showNotification('Image deleted successfully', 'success');
        });
        
        previewItem.appendChild(img);
        previewItem.appendChild(deleteButton);
        previewContainer.appendChild(previewItem);
    });
}

// Initialize owner panel
function initializeOwnerPanel() {
    const ownerLoginButton = document.getElementById('owner-login-button');
    const ownerLoginError = document.getElementById('owner-login-error');
    const ownerLogin = document.getElementById('owner-login');
    const ownerDashboard = document.getElementById('owner-dashboard');
    
    ownerLoginButton.addEventListener('click', () => {
        const password = document.getElementById('owner-password').value;
        const ownerPassword = storage.getItem('ownerPassword');
        
        if (password === ownerPassword) {
            ownerLogin.classList.add('hidden');
            ownerDashboard.classList.remove('hidden');
            
            // Load admin credentials
            const adminCredentials = storage.getItem('adminCredentials');
            document.getElementById('admin-new-username').value = adminCredentials.username;
            document.getElementById('admin-new-password').value = adminCredentials.password;
            
            // Load developer code
            document.getElementById('developer-html-code').value = storage.getItem('developerCode') || '';
            
            showNotification('Owner login successful!', 'success');
        } else {
            // Show password error modal
            document.getElementById('password-modal').style.display = 'block';
        }
    });
    
    // Update admin credentials
    document.getElementById('update-admin-credentials').addEventListener('click', () => {
        const newUsername = document.getElementById('admin-new-username').value.trim();
        const newPassword = document.getElementById('admin-new-password').value;
        
        if (!newUsername || !newPassword) {
            // Show validation modal
            document.getElementById('validation-modal').style.display = 'block';
            return;
        }
        
        storage.setItem('adminCredentials', {
            username: newUsername,
            password: newPassword
        });
        
        showNotification('Admin credentials updated successfully!', 'success');
    });
    
    // Update developer code
    document.getElementById('update-developer-code').addEventListener('click', () => {
        const code = document.getElementById('developer-html-code').value;
        storage.setItem('developerCode', code);
        showNotification('Developer code updated successfully!', 'success');
    });
}

// Share location with improved UI and automatic detection
function shareLocation() {
    const locationBtn = document.getElementById('share-location-btn');
    const locationStatus = document.getElementById('location-status');
    
    // Change button text and add loader
    locationBtn.innerHTML = '<span class="location-loader mr-2"></span> Detecting location...';
    locationBtn.disabled = true;
    
    // Show status loading message
    locationStatus.classList.remove('hidden');
    locationStatus.textContent = 'Requesting location...';
    locationStatus.className = 'mt-2 text-sm text-gray-600';
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Store the location immediately
                window.tempLatitude = position.coords.latitude;
                window.tempLongitude = position.coords.longitude;
                
                // Wait for 2 seconds to simulate loading and give visual feedback
                setTimeout(() => {
                    // Update button text and re-enable
                    locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Location Detected';
                    locationBtn.disabled = false;
                    locationBtn.style.backgroundColor = '#28a745'; // Green color to indicate success
                    
                    // Show success message
                    locationStatus.textContent = 'Location detected successfully! Ready to share with order.';
                    locationStatus.className = 'mt-2 text-sm text-green-600 font-semibold';
                    
                    showNotification('Location detected successfully!', 'success');
                }, 2000);
            },
            (error) => {
                setTimeout(() => {
                    let errorMessage = 'Error getting location: ';
                    
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += 'Location permission denied.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += 'Location information unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMessage += 'Location request timed out.';
                            break;
                        default:
                            errorMessage += 'Unknown error occurred.';
                            break;
                    }
                    
                    // Reset button
                    locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Turn On Location';
                    locationBtn.disabled = false;
                    locationBtn.style.backgroundColor = ''; // Reset color
                    
                    // Show error
                    locationStatus.textContent = errorMessage;
                    locationStatus.className = 'mt-2 text-sm text-red-600';
                    
                    showNotification(errorMessage, 'error');
                }, 2000);
            },
            // Options with high accuracy and timeout
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        setTimeout(() => {
            // Reset button
            locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Turn On Location';
            locationBtn.disabled = false;
            locationBtn.style.backgroundColor = ''; // Reset color
            
            // Show error
            const errorMessage = 'Geolocation is not supported by this browser.';
            locationStatus.textContent = errorMessage;
            locationStatus.className = 'mt-2 text-sm text-red-600';
            
            showNotification(errorMessage, 'error');
        }, 2000);
    }
}

// Order form functions
function openOrderForm(serviceType) {
    // Pre-select the service category based on which service was clicked
    const serviceSelect = document.getElementById('service-type');
    
    // Clear previous selection
    serviceSelect.selectedIndex = 0;
    
    // Try to match a service option
    if (serviceType === 'Drawing Board') {
        // Don't select specific option, let user choose between new/used
    } else if (serviceType === 'Mathematical Set') {
        for (let i = 0; i < serviceSelect.options.length; i++) {
            if (serviceSelect.options[i].value === 'Mathematical set') {
                serviceSelect.selectedIndex = i;
                break;
            }
        }
    } else if (serviceType === 'Router') {
        // Don't select specific option, let user choose between router types
    } else if (serviceType === 'SIM Card') {
        // No specific option for SIM cards in the dropdown
    } else if (serviceType === 'SME Bundle') {
        // No specific option for SME bundles in the dropdown
    } else if (serviceType === 'Papers') {
        // Don't select specific option, let user choose between paper types
    }
    
    serviceTypeChanged();
    document.getElementById('order-modal').style.display = 'block';
    
    // Clear form fields
    document.getElementById('full-name').value = '';
    document.getElementById('phone-number').value = '';
    document.getElementById('location').selectedIndex = 0;
    document.getElementById('college').value = '';
    document.getElementById('block-number').value = '';
    document.getElementById('room-number').value = '';
    document.getElementById('other-location-detail').value = '';
    document.getElementById('amount').value = '';
    
    // Hide additional location fields
    document.getElementById('udom-fields').classList.add('hidden');
    document.getElementById('other-location').classList.add('hidden');
    
    // Clear temporary location variables
    window.tempLatitude = null;
    window.tempLongitude = null;
    
    // Reset location status
    const locationStatus = document.getElementById('location-status');
    locationStatus.classList.add('hidden');
    
    // Reset location button
    const locationBtn = document.getElementById('share-location-btn');
    locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Share live Location';
    locationBtn.disabled = false;
    
    // Add click event for share location button
    document.getElementById('share-location-btn').onclick = shareLocation;
}

function locationChanged() {
    const location = document.getElementById('location').value;
    const udomFields = document.getElementById('udom-fields');
    const otherLocation = document.getElementById('other-location');
    
    if (location === 'Udom') {
        udomFields.classList.remove('hidden');
        otherLocation.classList.add('hidden');
    } else if (location === 'Other') {
        udomFields.classList.add('hidden');
        otherLocation.classList.remove('hidden');
    } else {
        udomFields.classList.add('hidden');
        otherLocation.classList.add('hidden');
    }
}

function serviceTypeChanged() {
    const serviceType = document.getElementById('service-type').value;
    const amountField = document.getElementById('amount-field');
    
    if (serviceType) {
        amountField.classList.remove('hidden');
    } else {
        amountField.classList.add('hidden');
    }
}

function submitOrder() {
    const name = document.getElementById('full-name').value.trim();
    const phone = document.getElementById('phone-number').value.trim();
    const location = document.getElementById('location').value;
    const service = document.getElementById('service-type').value;
    const amount = document.getElementById('amount').value;
    
    // Validate required fields
    if (!name || !phone || !location || !service) {
        // Show the validation modal instead of alert
        document.getElementById('validation-modal').style.display = 'block';
        return;
    }
    
    // Get current user ID
    const userId = getCurrentUserId();
    
    // Get location details based on location type
    let locationDetails = {};
    
    if (location === 'Udom') {
        locationDetails = {
            college: document.getElementById('college').value.trim(),
            blockNumber: document.getElementById('block-number').value.trim(),
            roomNumber: document.getElementById('room-number').value.trim()
        };
    } else if (location === 'Other') {
        locationDetails = {
            otherLocation: document.getElementById('other-location-detail').value.trim()
        };
    }
    
    // Create order object with geolocation if available
    const order = {
        id: order-${Date.now()},
        userId: userId, // Add user ID to order
        name: name,
        phone: phone,
        location: location,
        service: service,
        amount: amount,
        timestamp: new Date().toISOString(),
        ...locationDetails
    };
    
    // Add geolocation if available
    if (window.tempLatitude && window.tempLongitude) {
        order.latitude = window.tempLatitude;
        order.longitude = window.tempLongitude;
    }
    
    // Save order
    const orders = storage.getItem('orders') || [];
    orders.push(order);
    storage.setItem('orders', orders);
    
    // Auto navigate to the orders tab and reload orders
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Remove active class from all tabs and contents
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to orders tab and content
    document.querySelector('.tab[data-tab="orders"]').classList.add('active');
    document.getElementById('orders-content').classList.add('active');
    
    // Load orders
    loadOrders();
    
    // Prepare WhatsApp message
    let message = *New Order from ALFONCE SERVICES*\n\n;
    message += *Name:* ${name}\n;
    message += *Phone:* ${phone}\n;
    message += *Location:* ${location}\n;
    
    if (location === 'Udom') {
        message += *College/School/Institute:* ${locationDetails.college || 'N/A'}\n;
        message += *Block Number:* ${locationDetails.blockNumber || 'N/A'}\n;
        message += *Room Number:* ${locationDetails.roomNumber || 'N/A'}\n;
    } else {
        message += *Location Details:* ${locationDetails.otherLocation || 'N/A'}\n;
    }
    
    message += *Service:* ${service}\n;
    if (amount) {
        message += *Amount:* ${amount}\n;
    }
    
    // Add GPS location if available
    if (order.latitude && order.longitude) {
        message += \n*GPS Location:* https://maps.google.com/?q=${order.latitude},${order.longitude}\n;
    }
    
    // Open WhatsApp with the message
    const encodedMessage = encodeURIComponent(message);
    window.open(https://wa.me/255766839045?text=${encodedMessage}, '_blank');
    
    // Show success notification
    showNotification('Order submitted successfully!', 'success');
    
    // Close modal and reset form
    closeModal('order-modal');
    resetOrderForm();
}

function resetOrderForm() {
    document.getElementById('full-name').value = '';
    document.getElementById('phone-number').value = '';
    document.getElementById('location').selectedIndex = 0;
    document.getElementById('service-type').selectedIndex = 0;
    document.getElementById('amount').value = '';
    document.getElementById('college').value = '';
    document.getElementById('block-number').value = '';
    document.getElementById('room-number').value = '';
    document.getElementById('other-location-detail').value = '';
    
    document.getElementById('udom-fields').classList.add('hidden');
    document.getElementById('other-location').classList.add('hidden');
    document.getElementById('amount-field').classList.add('hidden');
    document.getElementById('location-status').classList.add('hidden');
    
    // Clear temporary location variables
    window.tempLatitude = null;
    window.tempLongitude = null;
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function openWhatsApp() {
    window.open('https://wa.me/255766839045', '_blank');
}

// Send email functionality
function initializeContactForm() {
    document.getElementById('send-email-button').addEventListener('click', function() {
        const email = document.getElementById('contact-email').value.trim();
        const message = document.getElementById('contact-message').value.trim();
        
        if (!email || !message) {
            // Show validation modal
            document.getElementById('validation-modal').style.display = 'block';
            return;
        }
        
        // Open Gmail with pre-filled message
        const subject = 'Inquiry from ALFONCE SERVICES website';
        const body = Message from: ${email}\n\n${message};
        const gmailUrl = https://mail.google.com/mail/?view=cm&fs=1&to=Agentrezo.37@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)};
        
        window.open(gmailUrl, '_blank');
        
        // Clear form
        document.getElementById('contact-email').value = '';
        document.getElementById('contact-message').value = '';
        
        showNotification('Email client opened with your message!', 'success');
    });
}

// Check dark mode
function checkDarkMode() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (event.matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    });
}

// Initialize application
window.addEventListener('DOMContentLoaded', () => {
    checkDarkMode();
    initializeDefaultData();
    initializeTabs();
    initializeSlideshow();
    initializeServiceSlideshows();
    initializeAdminPanel();
    initializeOwnerPanel();
    initializeContactForm();
    loadCustomServicesToMainPage();
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to ALFONCE SERVICES!', 'success');
    }, 1000);
});