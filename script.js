document.addEventListener('DOMContentLoaded', () => {
  // 모든 내부 링크 중에서 '#'로 시작하는 앵커만 선택
  const smoothLinks = document.querySelectorAll('a[href^="#"]');
  
  smoothLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // 기본 클릭 동작(바로 점프) 방지
      e.preventDefault();
      
      // 이동할 대상 섹션의 id 가져오기
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      // 대상 섹션이 존재한다면, 스크롤 이동 (부드럽게)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});
