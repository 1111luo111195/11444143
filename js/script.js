    // Only the visible active navigation pill changes; other content is static, like the reference image.
    const navLinks = [...document.querySelectorAll('.top-nav a')];
    navLinks.forEach(link => link.addEventListener('click', () => {
      navLinks.forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }));
    // [互動特效] View Project：開啟置中彈跳視窗，背景模糊半透明
    const projectModal = document.getElementById('project-modal');
    const closeModalButton = document.getElementById('modal-close');
    const doneModalButton = document.getElementById('modal-done');
    let previousFocus = null;

    const clubDetails = document.getElementById('club-project-details');
    const beachDetails = document.getElementById('beach-project-details');
    const sdgDetails = document.getElementById('sdg-project-details');
    const bookDetails = document.getElementById('book-project-details');
    const projectImageWrap = document.getElementById('modal-project-image-wrap');
    document.querySelectorAll('.view-project').forEach(button => {
      button.addEventListener('click', () => {
        const card = button.closest('.project');
        previousFocus = button;
        document.getElementById('modal-project-title').textContent =
          card.querySelector('.project-banner-content h3')?.textContent.trim() || 'Project Title';
        document.getElementById('modal-project-date').textContent =
          '';
        const description = button.dataset.description || '';
        const modalImage = document.getElementById('modal-project-image');
        modalImage.src = button.dataset.image;
        modalImage.alt = card.querySelector('h3')?.textContent.trim() || '專案照片';
        const isClub = button.dataset.project === '1';
        const isBeach = button.dataset.project === '2';
        const isSdg = button.dataset.project === '3';
        const isBook = button.dataset.project === '4';
        clubDetails.hidden = !isClub;
        beachDetails.hidden = !isBeach;
        sdgDetails.hidden = !isSdg;
        bookDetails.hidden = !isBook;
        projectImageWrap.hidden = isClub || isBeach || isSdg || isBook;
        document.getElementById('modal-project-description').hidden = isClub || isBeach || isSdg || isBook;
        document.getElementById('modal-project-description').textContent =
          description && description !== '待填寫' ? description : '專案詳細內容待填寫，之後可以在這裡加入介紹、成果與圖片。';
        projectModal.classList.toggle('club-project-open', isClub || isBeach || isSdg || isBook);
        projectModal.scrollTop = 0;
        projectModal.showModal();
      });
    });

    function closeProjectModal() {
      projectModal.close();
    }
    closeModalButton.addEventListener('click', closeProjectModal);
    doneModalButton.addEventListener('click', closeProjectModal);
    // 點擊彈跳窗外的半透明區域即可關閉
    projectModal.addEventListener('click', event => {
      if (event.target === projectModal) closeProjectModal();
    });
    // Esc 由原生 dialog 自動處理，關閉後焦點回到原按鈕
    projectModal.addEventListener('close', () => previousFocus?.focus());
    // 聯絡表單：按下「聯絡我」才開啟，點外部或 Esc 可關閉。
    const contactModal = document.getElementById('contact-modal');
    const contactTrigger = document.getElementById('open-contact-modal');
    contactTrigger.addEventListener('click', () => contactModal.showModal());
    document.getElementById('contact-modal-close').addEventListener('click', () => contactModal.close());
    contactModal.addEventListener('click', event => {
      if (event.target === contactModal) contactModal.close();
    });
    contactModal.addEventListener('close', () => contactTrigger.focus());
    // 展示用表單：不會真的寄送，避免誤導使用者。
    document.getElementById('contact-form').addEventListener('submit', event => {
      event.preventDefault();
      document.getElementById('form-message').style.display = 'block';
    });

    // 成果發表：點擊封面後播放本地精彩片段；離開作品時暫停影片。
    const clubVideoTrigger = document.querySelector('.club-video-trigger');
    const clubPerformanceVideo = document.querySelector('.club-performance-video');
    clubVideoTrigger?.addEventListener('click', () => {
      clubVideoTrigger.hidden = true;
      clubPerformanceVideo.hidden = false;
      clubPerformanceVideo.play().catch(() => {});
    });
    projectModal.addEventListener('close', () => {
      clubPerformanceVideo?.pause();
    });
    // [互動特效] 活動相簿：照片放大檢視，可點外側或按 Esc 關閉
    const clubPhotoModal = document.getElementById('club-photo-modal');
    document.querySelectorAll('.club-photo-button').forEach(button => {
      button.addEventListener('click', () => {
        document.getElementById('club-photo-full').src = button.dataset.photo;
        document.getElementById('club-photo-full').alt = button.dataset.caption;
        document.getElementById('club-photo-caption').textContent = button.dataset.caption;
        clubPhotoModal.showModal();
      });
    });
    document.getElementById('club-photo-close').addEventListener('click', () => clubPhotoModal.close());
    clubPhotoModal.addEventListener('click', event => {
      if (event.target === clubPhotoModal) clubPhotoModal.close();
    });


// [互動特效] 背景音樂：進站自動嘗試播放；若瀏覽器限制有聲自動播放，首次互動時重試。
// [互動特效] 播放成果發表影片時暫停音樂，影片暫停、結束或關閉彈窗後恢復。
(() => {
  const music = document.getElementById('bg-music');
  const video = document.querySelector('.club-performance-video');
  if (!music) return;
  music.volume = 0.35;
  let videoPlaying = false;

  async function startMusic() {
    if (videoPlaying || !music.paused) return;
    try {
      await music.play();
    } catch (error) {
      // Chrome、Safari 等瀏覽器可能禁止使用者互動前的有聲自動播放。
    }
  }
  startMusic();
  // 若進站自動播放被阻擋，在第一次互動時重試；不顯示播放按鈕。
  document.addEventListener('pointerdown', startMusic, { once: true });
  document.addEventListener('keydown', startMusic, { once: true });

  if (video) {
    video.addEventListener('play', () => {
      videoPlaying = true;
      music.pause();
    });
    const resumeMusic = () => {
      videoPlaying = false;
      startMusic();
    };
    video.addEventListener('pause', resumeMusic);
    video.addEventListener('ended', resumeMusic);
    const modal = video.closest('dialog');
    if (modal) modal.addEventListener('close', resumeMusic);
  }
})();
