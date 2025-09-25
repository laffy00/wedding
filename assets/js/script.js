// 손글씨 인트로 애니메이션 효과
document.addEventListener('DOMContentLoaded', function() {
    const svg = document.getElementById('wedding-svg');
    const weddingText = document.getElementById('wedding-text');
    const introContainer = document.querySelector('.intro-container');
    if (!svg || !weddingText || !introContainer) {
        document.body.style.overflow = 'auto';
        return;
    }
    document.body.style.overflow = 'hidden';
    
    // SVG <text> stroke 애니메이션
    const animateTextStroke = () => {
        // 텍스트를 path로 변환하지 않고 stroke-dasharray로 애니메이션
        weddingText.setAttribute('opacity', '1');
        // 텍스트 길이 측정
        const length = weddingText.getComputedTextLength();
        weddingText.setAttribute('stroke-dasharray', length);
        weddingText.setAttribute('stroke-dashoffset', length);
        const duration = 3000;
        const startTime = performance.now();
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            weddingText.setAttribute('stroke-dashoffset', length * (1 - progress));
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setTimeout(() => {
                    introContainer.style.animation = 'fadeOut 0.5s ease-in-out forwards';
                    setTimeout(() => {
                        document.body.style.overflow = 'auto';
                        introContainer.remove();
                        const heroSection = document.querySelector('.hero-section');
                        if (heroSection) {
                            heroSection.style.transition = 'opacity 0.7s';
                            heroSection.style.opacity = '1';
                        }
                    }, 500);
                }, 500);
            }
        }
        requestAnimationFrame(animate);
    };
    
    // 히어로 섹션 미리 숨김
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.opacity = '0';
    }
    // 0.3초 뒤 stroke 애니메이션 시작
    setTimeout(animateTextStroke, 300);
    
    // 클릭으로 건너뛰기
    introContainer.addEventListener('click', () => {
        introContainer.style.animation = 'fadeOut 0.5s ease-in-out forwards';
        setTimeout(() => {
            document.body.style.overflow = 'auto';
            introContainer.remove();
        }, 500);
    });
});

// 카카오맵 API 초기화 및 마커 생성
var mapContainer = document.getElementById('map'),
    mapOption = {
        center: new kakao.maps.LatLng(37.458606, 126.685166),
        level: 4
    };

var map = new kakao.maps.Map(mapContainer, mapOption);

var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
    imageSize = new kakao.maps.Size(64, 69),
    imageOption = {offset: new kakao.maps.Point(27, 69)};
      
var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
    markerPosition = new kakao.maps.LatLng(37.458606, 126.685166);

var marker = new kakao.maps.Marker({
    position: markerPosition,
    image: markerImage
});

marker.setMap(map);

// 캘린더 생성 (2025년 9월 25일 강조)
const calendarEl = document.getElementById('calendar');
// 현재 날짜: 2025년 9월 25일
const weddingDate = new Date('2025-09-25T00:00:00'); 
const year = weddingDate.getFullYear();
const month = weddingDate.getMonth();

function generateCalendar(year, month) {
    const today = new Date();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();

    // 월과 연도 표시
    let calendarHtml = `<h3 class="calendar-header">${year}년 ${month + 1}월</h3>`;
    calendarHtml += '<table><thead><tr>';
    
    // 요일 표시 (일요일부터 시작)
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    dayNames.forEach(day => {
        calendarHtml += `<th>${day}</th>`;
    });
    calendarHtml += '</tr></thead><tbody><tr>';

    // 첫 주 빈칸 채우기
    for (let i = 0; i < startDayOfWeek; i++) {
        calendarHtml += '<td></td>';
    }

    // 날짜 채우기
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const currentDate = new Date(year, month, day);
        const isWeddingDay = currentDate.toDateString() === weddingDate.toDateString();

        if ((day - 1 + startDayOfWeek) % 7 === 0 && day !== 1) {
            calendarHtml += '</tr><tr>';
        }

        const classList = [];
        if (isWeddingDay) {
            classList.push('wedding-day-highlight');
        }
        
        calendarHtml += `<td><span class="${classList.join(' ')}">${day}</span></td>`;
    }

    calendarHtml += '</tr></tbody></table>';
    calendarEl.innerHTML = calendarHtml;
}

generateCalendar(year, month);


// 갤러리 모달 기능 구현
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeBtn = document.getElementsByClassName('close-btn')[0];
const galleryItems = document.querySelectorAll('.gallery-item');

// Intersection Observer로 갤러리 섹션이 보일 때 애니메이션 발동
const gallerySection = document.querySelector('.gallery-section');
if (gallerySection && galleryItems.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                galleryItems.forEach((item, idx) => {
                    setTimeout(() => {
                        item.classList.add('active');
                    }, idx * 120); // 등장 순서별 딜레이
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.2 });
    observer.observe(gallerySection);
}

// 갤러리 아이템 클릭 시 모달 열기
galleryItems.forEach(item => {
        item.addEventListener('click', function() {
                modal.style.display = 'flex'; // flex로 설정하여 이미지를 중앙 정렬
                modalImage.src = this.getAttribute('data-img-src');
        });
        // 마우스 오버 시 확대 효과
        item.addEventListener('mouseenter', function() {
                item.classList.add('hovered');
        });
        item.addEventListener('mouseleave', function() {
                item.classList.remove('hovered');
        });
});

// 닫기 버튼 클릭 시 모달 닫기
closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
});

// 모달 외부 영역 클릭 시 모달 닫기
window.addEventListener('click', function(event) {
        if (event.target === modal) {
                modal.style.display = 'none';
        }
});