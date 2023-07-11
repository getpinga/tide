var bb = {
    event: function(name, params) {
        var event = new CustomEvent(name, { detail: params });
        document.dispatchEvent(event);
    },

    post: function(url, params, jsonp) {
        fetch(bb.restUrl(url), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
        .then(response => response.json())
        .then(data => {
            document.querySelector('.wait').style.display = 'none';
            if(data.error) {
                bb.event('bb_ajax_post_message_error', data);
                bb.msg(data.error.message, 'error');
            } else {
                if(typeof jsonp === 'function') {
                    return jsonp(data.result);
                } else if(window.hasOwnProperty('console')) {
                    console.log(data.result);
                }
            }
        })
        .catch(e => {
            document.querySelector('.wait').style.display = 'none';
            bb.msg(e, 'error');
        });
    },

    get: function(url, params, jsonp) {
        var query = Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
        fetch(bb.restUrl(url) + '?' + query)
            .then(response => response.json())
            .then(data => {
                document.querySelector('.wait').style.display = 'none';
                if(data.error) {
                    bb.msg(data.error.message, 'error');
                } else {
                    if(typeof jsonp === 'function') {
                        return jsonp(data.result);
                    } else if(window.hasOwnProperty('console')) {
                        console.log(data.result);
                    }
                }
            })
            .catch(e => {
                document.querySelector('.wait').style.display = 'none';
                bb.msg(e, 'error');
            });
    },

    restUrl: function(url) {
        if(url.indexOf('http://') > -1 || url.indexOf('https://') > -1) {
            return url;
        }
        return document.querySelector('meta[property="bb:url"]').getAttribute("content") + 'index.php?_url=/api/' + url;
    },

    reload: function() {
        location.reload(false);
    },

    redirect: function(url) {
        if(url === undefined) {
            window.location = document.querySelector('meta[property="bb:url"]').getAttribute("content");
        } else {
            window.location = url;
        }
    },

    currency: function(price, rate, title, multiply) {
        price = parseFloat(price) * parseFloat(rate);
        if(multiply !== undefined) {
            price = price * multiply;
        }
        return price.toFixed(2) + " " + title;
    },

    msg: function(txt, type) {
        let color;
        switch (type) {
            case 'error':
                color = 'danger';
                break;
            case 'warning':
                color = 'warning';
                break;
            default:
                color = 'primary';
        }

        const container = document.createElement('div');
        container.classList.add('position-fixed', 'bottom-0', 'end-0', 'p-3');
        container.style.zIndex = 1070;

        const element = document.createElement('div');
        element.setAttribute('id', 'liveToast');
        element.classList.add('toast');
        element.setAttribute('role', 'alert');
        element.setAttribute('aria-live', 'assertive');
        element.setAttribute('aria-atomic', 'true');

        element.innerHTML = `
            <div class="toast-header">
                <span class="p-2 border border-light bg-${color} rounded-circle me-2"></span>
                <strong class="me-auto">System message</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">${txt}</div>
        `;

        element.addEventListener('hidden.bs.toast', () => {
            container.remove();
        });

        const toast = new bootstrap.Toast(element);

        container.appendChild(element);

        document.querySelector('body').appendChild(container);

        toast.show();
    },

    apiForm: function() {
        let forms = document.querySelectorAll('form.api_form, form.api-form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e){
                e.preventDefault();
                var redirect = form.getAttribute('data-api-redirect');
                var jsonp = form.getAttribute('data-api-jsonp');
                var msg = form.getAttribute('data-api-msg');
                var reload = form.getAttribute('data-api-reload');
                var url = form.getAttribute('action');
                if(form.getAttribute('data-api-url')) {
                    url = form.getAttribute('data-api-url');
                }
                let formData = new FormData(form);
                bb.post(
                    url,
                    Object.fromEntries(formData),
                    function(result) {
                        if(reload !== undefined) {
                            bb.reload();
                            return;
                        }
                        if(redirect !== undefined) {
                            bb.redirect(redirect);
                            return;
                        }
                        if(msg !== undefined) {
                            bb.msg(msg);
                            return;
                        }
                        if(jsonp !== undefined && window.hasOwnProperty(jsonp)) {
                            return window[jsonp](result);
                        }
                    }
                );
                return false;
            });
        });
    },

    apiLink: function() {
        let links = document.querySelectorAll('a.api, a.api-link');
        links.forEach(link => {
            link.addEventListener('click', function(e){
                e.preventDefault();
                var redirect = link.getAttribute('data-api-redirect');
                var reload = link.getAttribute('data-api-reload');
                var msg = link.getAttribute('data-api-msg');
                var jsonp = link.getAttribute('data-api-jsonp');
                bb.get(
                    link.getAttribute('href'),
                    {},
                    function(result) {
                        if(msg !== undefined) {
                            bb.msg(msg);
                            return;
                        }
                        if(reload !== undefined) {
                            bb.reload();
                            return;
                        }
                        if(jsonp !== undefined && window.hasOwnProperty(jsonp)) {
                            return window[jsonp](result);
                        }
                        bb.redirect(redirect);
                    }
                );
                return false;
            });
        });
    },

    cookieCreate: function(name, value, days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        let expires = "; expires=" + date.toGMTString();
        document.cookie = name + "=" + value + expires + "; path=/";
    },

    cookieRead: function(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    CurrencySelector: function() {
        let selectors = document.querySelectorAll('select.currency_selector');
        selectors.forEach(selector => {
            selector.addEventListener('change', function() {
                bb.post(
                    'guest/cart/set_currency',
                    {currency: selector.value},
                    function(result) {
                        bb.reload();
                    }
                );
                return false;
            });
        });
    },

    LanguageSelector: function() {
        let selectors = document.querySelectorAll('a.language_selector');
        selectors.forEach(selector => {
            selector.addEventListener('click', function(e) {
                e.preventDefault();
                bb.cookieCreate('BBLANG', selector.value, 7);
                bb.reload();
                return false;
            });
            selector.value = bb.cookieRead('BBLANG');
        });
    },

// Placeholder for all browsers
document.querySelectorAll('input').forEach(input => {
    if(input.value === '' && input.hasAttribute('placeholder')) {
        input.value = input.getAttribute('placeholder');
        input.addEventListener('focus', function() {
            if(input.value === input.getAttribute('placeholder')) input.value = '';
        });
        input.addEventListener('blur', function() {
            if(input.value === '') input.value = input.getAttribute('placeholder');
        });
    }
});

// Document ready
document.addEventListener('DOMContentLoaded', function() {
    // Loading indicator
    let loading = document.querySelector('.loading');
    document.addEventListener('ajaxStart', function() {
        loading.style.display = 'block';
    });
    document.addEventListener('ajaxStop', function() {
        loading.style.display = 'none';
    });

    // Init functions
    if(document.querySelector('select.currency_selector')) bb.CurrencySelector();
    if(document.querySelector('a.language_selector')) bb.LanguageSelector();
    if(document.querySelector('ul.main')) bb.MenuAutoActive();
    if(document.querySelector('a.api, a.api-link')) bb.apiLink();
    if(document.querySelector('form.api_form, form.api-form')) bb.apiForm();

    // Login form link
    document.querySelector('#login-form-link').addEventListener('click', function(e) {
        e.preventDefault();
        this.style.display = 'none';
        document.querySelector('#login-form').style.display = 'block';
    });

    // Language selector
    document.querySelectorAll('a.language_selector').forEach(selector => {
        selector.addEventListener('click', function(e) {
            e.preventDefault();
            bb.cookieCreate('BBLANG', selector.getAttribute('data-language-code'), 7);
            bb.reload();
        });
        selector.value = bb.cookieRead('BBLANG');
    });
});

}
