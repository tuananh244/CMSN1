(function () {
    'use strict';

    const els = {
        d: initElements('d'),
        h: initElements2('h'),
        m: initElements2('m'),
        s: initElements2('s'),
    };

    function initElements(type){
        let els = [{}, {}, {}];
        const target = document.querySelector(`.flip-clock-${type}`);
        if (!target) return els;

        let el;
        el = els[0];
        el.digit = target.querySelector('.digit-left');
        el.card = el.digit.querySelector('.card');
        el.cardFaces = el.card.querySelectorAll('.card-face');
        el.cardFaceA = el.cardFaces[0];
        el.cardFaceB = el.cardFaces[1];

        el = els[1];
        el.digit = target.querySelector('.digit-middle');
        el.card = el.digit.querySelector('.card');
        el.cardFaces = el.card.querySelectorAll('.card-face');
        el.cardFaceA = el.cardFaces[0];
        el.cardFaceB = el.cardFaces[1];

        el = els[2];
        el.digit = target.querySelector('.digit-right');
        el.card = el.digit.querySelector('.card');
        el.cardFaces = el.card.querySelectorAll('.card-face');
        el.cardFaceA = el.cardFaces[0];
        el.cardFaceB = el.cardFaces[1];

        return els;
    };

    function initElements2(type){
        let els = [{}, {}];
        const target = document.querySelector(`.flip-clock-${type}`);
        if (!target) return els;

        let el;
        el = els[0];
        el.digit = target.querySelector('.digit-left');
        el.card = el.digit.querySelector('.card');
        el.cardFaces = el.card.querySelectorAll('.card-face');
        el.cardFaceA = el.cardFaces[0];
        el.cardFaceB = el.cardFaces[1];

        el = els[1];
        el.digit = target.querySelector('.digit-right');
        el.card = el.digit.querySelector('.card');
        el.cardFaces = el.card.querySelectorAll('.card-face');
        el.cardFaceA = el.cardFaces[0];
        el.cardFaceB = el.cardFaces[1];

        return els;
    };

    (function runCountdown() {
        // Chỉnh sửa thời gian countdown theo yêu cầu
        const countdownTarget = new Date(Date.UTC(2025, 3, 1, 16, 59, 59)).getTime();

        function updateCountdown() {
            const now = new Date();
            let timeDiff = Math.max(0, Math.floor((countdownTarget - now) / 1000));
            const messageElement = document.querySelector(".countdown-text");

            let message = "";
            if (timeDiff <= 10) {  // Dưới 10 giây
                message = "Sắp tới giờ nè!!!";
                messageElement.classList.remove("medium");
                messageElement.classList.add("soon");
            } else if (timeDiff <= 60) {  // Dưới 60 giây
                message = "Không còn nhiều đâu...";
                messageElement.classList.remove("long");
                messageElement.classList.add("medium");
            } else {  // Trên 60 giây
                message = "Còn lâu!";
                messageElement.classList.add("long");
            }
            messageElement.textContent = message;

            if (timeDiff <= 0) {
                const countdownElement = document.querySelector('.flip-clock-container');
                const bookElement = document.querySelector('.book');
                const containerElement = document.querySelector('#container');
                const btnActivate = document.getElementById('activateBook');
                if (!messageElement) {
                    console.error("Phần tử countdown-text không tồn tại!");
                    return;
                }

                if (countdownElement) {
                    countdownElement.style.transition = 'opacity 3s ease-out';
                    countdownElement.style.opacity = '0';
                    setTimeout(() => {
                        countdownElement.style.display = 'none';

                        // Hiển thị nút button
                        btnActivate.style.display = 'block';
                        btnActivate.style.opacity = '0';
                        btnActivate.style.transition = 'opacity 3s ease-in';
                        setTimeout(() => {
                            btnActivate.style.opacity = '1';
                        }, 50);

                        // Đăng ký sự kiện click cho btnActivate
                        btnActivate.addEventListener('click', function handleActivate() {
                            // Đổi nền cho container
                            containerElement.style.transition = 'background 3s ease-in-out';
                            containerElement.style.background = 'linear-gradient(to bottom, #F0EDED, rgb(209, 236, 210), rgb(215, 230, 216), rgb(190, 227, 191))';

                            // Hiển thị book với hiệu ứng fade-in
                            if (bookElement) {
                                bookElement.style.display = 'block';
                                bookElement.style.opacity = '0';
                                setTimeout(() => {
                                    bookElement.style.transition = 'opacity 3s ease-in';
                                    bookElement.style.opacity = '1';
                                }, 50);
                            }
                            
                            // Ẩn nút button sau khi kích hoạt
                            btnActivate.style.display = 'none';
                            // Xóa sự kiện click nếu không cần thiết nữa
                            btnActivate.removeEventListener('click', handleActivate);
                        });
                    }, 1000);
                }
                return;  // Kết thúc hàm khi countdown về 0
            }

            // Cập nhật các chữ số hiển thị countdown
            const timeLeft = {
                d: String(Math.floor(timeDiff / 86400)).padStart(3, '0'),
                h: String(Math.floor((timeDiff % 86400) / 3600)).padStart(2, '0'),
                m: String(Math.floor((timeDiff % 3600) / 60)).padStart(2, '0'),
                s: String(timeDiff % 60).padStart(2, '0'),
            };

            for (const t of Object.keys(els)) {
                for (let i = 0; i < els[t].length; i++) {
                    const curr = timeLeft[t][i];
                    let maxValue = (i === 0) ? 3 : 10;  // Hàng chục của giờ chỉ có 0-2
                    if (t === 'h' && i === 0 && timeLeft.h[0] === '0' && timeLeft.h[1] === '0') {
                        maxValue = 2;  // Giới hạn hàng chục giờ (0-2)
                    } else if (t === 'm' || t === 's') {
                        maxValue = (i === 0) ? 6 : 10;  // Hàng chục phút/giây chỉ có 0-5
                    }

                    let next = (parseInt(curr) - 1 + maxValue) % maxValue;
                    const el = els[t][i];
                    if (el && el.digit) {
                        if (!el.digit.dataset.digitBefore) {
                            el.digit.dataset.digitBefore = curr;
                            el.cardFaceA.textContent = curr;
                            el.digit.dataset.digitAfter = next;
                            el.cardFaceB.textContent = next;
                        } else if (el.digit.dataset.digitBefore !== curr) {
                            el.card.addEventListener('transitionend', function () {
                                el.digit.dataset.digitBefore = curr;
                                el.cardFaceA.textContent = curr;

                                const cardClone = el.card.cloneNode(true);
                                cardClone.classList.remove('flipped');
                                el.digit.replaceChild(cardClone, el.card);
                                el.card = cardClone;
                                el.cardFaces = el.card.querySelectorAll('.card-face');
                                el.cardFaceA = el.cardFaces[0];
                                el.cardFaceB = el.cardFaces[1];

                                el.digit.dataset.digitAfter = next;
                                el.cardFaceB.textContent = next;
                            }, { once: true });

                            if (!el.card.classList.contains('flipped')) {
                                el.card.classList.add('flipped');
                            }
                        }
                    }
                }
            }
            setTimeout(updateCountdown, 1000);
        }

        updateCountdown();
    })();
})();
