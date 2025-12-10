// The Atlantic Doers - Retro IBM 5150 Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Flag: apakah profil sudah dipilih
    let profileSelected = false;
    // Flag: apakah overlay loading sedang aktif
    let loadingOverlayActive = false;
    // Boot sequence with IBM beep simulation
    function bootSequence() {
        const bootScreen = document.getElementById('boot-screen');
        const desktop = document.getElementById('desktop');
        const statusBar = document.getElementById('status-bar');
        
        // IBM beep sound simulation using Web Audio API
        function playIBMBeep() {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 1000; // 1kHz beep
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }
        
        // Play initial beep
        setTimeout(() => playIBMBeep(), 500);
        
        // Transition to desktop after boot sequence
        setTimeout(() => {
            bootScreen.classList.add('hidden');
            desktop.classList.remove('hidden');
            if (statusBar) {
                statusBar.classList.remove('hidden');
            }
            playIBMBeep(); // Success beep
        }, 4500);
    }
    
    // Desktop icon interactions
    function setupDesktopIcons() {
        const icons = document.querySelectorAll('.icon');
        
        icons.forEach(icon => {
            icon.addEventListener('click', function() {
                const windowName = this.getAttribute('data-window');
                openTerminalWindow(windowName);
                
                // Play click sound
                playClickSound();
            });
        });
    }

    // Error bar ketika user membuka window selain About sebelum pilih profil
    function showProfileRequiredWarning() {
        let overlay = document.getElementById('profile-required-warning');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'profile-required-warning';
            overlay.style.position = 'fixed';
            overlay.style.inset = '0';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.background = 'rgba(0,0,0,0.75)';
            overlay.style.backdropFilter = 'blur(2px)';
            overlay.style.zIndex = '10001';

            const box = document.createElement('div');
            box.className = 'profile-warning-box';
            box.style.padding = '12px 24px';
            box.style.border = '2px solid #00ff00';
            box.style.backgroundColor = 'rgba(0,0,0,0.95)';
            box.style.color = '#00ff00';
            box.style.fontFamily = '"Share Tech Mono", monospace';
            box.style.fontSize = '12px';
            box.style.textAlign = 'center';
            box.style.textShadow = '0 0 4px #00ff00';
            box.style.boxShadow = '0 0 12px rgba(0,255,0,0.7)';

            const p = document.createElement('p');
            p.textContent = 'ERROR: Harap pilih profil pengguna terlebih dahulu dengan mengklik ikon PROFIL berwarna biru (👤) di status bar.';

            box.appendChild(p);
            overlay.appendChild(box);
            document.body.appendChild(overlay);
        } else {
            const p = overlay.querySelector('p');
            if (p) {
                p.textContent = 'ERROR: Harap pilih profil pengguna terlebih dahulu dengan mengklik ikon PROFIL berwarna biru (👤) di status bar.';
            }
        }

        overlay.style.display = 'flex';

        // Auto-hide setelah beberapa detik
        clearTimeout(overlay._hideTimer);
        overlay._hideTimer = setTimeout(function() {
            overlay.style.display = 'none';
        }, 3000);
    }

    function hideProfileRequiredWarning() {
        const overlay = document.getElementById('profile-required-warning');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
    
    // Terminal window management
    function openTerminalWindow(windowName) {
        // Sebelum profil dipilih, hanya izinkan jendela ABOUT dibuka
        if (!profileSelected && windowName !== 'about') {
            showProfileRequiredWarning();
            return;
        }

        const win = document.getElementById(`${windowName}-window`);
        if (!win) return;

        // Khusus kalkulator & minesweeper: sejajarkan vertikal dengan pasangannya jika sudah terbuka
        if (windowName === 'calculator' || windowName === 'minesweeper') {
            const partnerName = windowName === 'calculator' ? 'minesweeper' : 'calculator';
            const partnerWin = document.getElementById(`${partnerName}-window`);

            if (partnerWin && !partnerWin.classList.contains('hidden')) {
                const rect = partnerWin.getBoundingClientRect();
                // Set posisi atas jendela baru agar sejajar secara visual
                win.style.top = rect.top + 'px';
                win.style.bottom = 'auto';
            }
        }

        win.classList.remove('hidden');
        // Efek ketik umum dinonaktifkan untuk mencegah format HTML berantakan
    }
    
    function closeTerminalWindow(windowName) {
        const window = document.getElementById(`${windowName}-window`);
        if (window) {
            window.classList.add('hidden');
        }
    }
    
    // Close button functionality
    function setupCloseButtons() {
        const closeButtons = document.querySelectorAll('.close-btn');
        
        closeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const windowName = this.getAttribute('data-window');
                closeTerminalWindow(windowName);
                playClickSound();
            });
        });
    }
    
    // Typing effect for terminal content
    function addTypingEffect(window) {
        const terminalText = window.querySelector('.terminal-text');
        if (terminalText && !terminalText.classList.contains('typed')) {
            terminalText.classList.add('typed');
            const text = terminalText.innerText;
            terminalText.innerText = '';
            let index = 0;
            
            function type() {
                if (index < text.length) {
                    terminalText.innerText += text[index];
                    index++;
                    setTimeout(type, 30); // Typing speed
                } else {
                    terminalText.classList.add('blinking-cursor');
                }
            }
            
            setTimeout(type, 200); // Start typing after window opens
        }
    }
    
    // Click sound effect
    function playClickSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    }

    // Error / "trojan" sound effect untuk easter egg
    function playErrorGlitchSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const duration = 0.6;

        const osc1 = audioContext.createOscillator();
        const osc2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(audioContext.destination);

        osc1.type = 'square';
        osc2.type = 'sawtooth';

        osc1.frequency.setValueAtTime(320, audioContext.currentTime);
        osc1.frequency.linearRampToValueAtTime(60, audioContext.currentTime + duration);

        osc2.frequency.setValueAtTime(120, audioContext.currentTime);
        osc2.frequency.linearRampToValueAtTime(20, audioContext.currentTime + duration);

        gainNode.gain.setValueAtTime(0.35, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        osc1.start(audioContext.currentTime);
        osc2.start(audioContext.currentTime);
        osc1.stop(audioContext.currentTime + duration);
        osc2.stop(audioContext.currentTime + duration);
    }
    
    // Download functionality
    function setupDownloadLinks() {
        const downloadLinks = document.querySelectorAll('.download-link');
        
        downloadLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const fileType = this.getAttribute('data-file');
                
                // Create dummy CV files for demonstration
                if (fileType === 'andra_cv') {
                    downloadCV('Andra_Kafka_Aletha_CV.pdf', 'Andra Kafka Aletha - Curriculum Vitae\n\nExperience:\n- Web Developer\n- UI/UX Designer\n- Digital Artist\n\nContact: andra@example.com');
                } else if (fileType === 'aidil_cv') {
                    downloadCV('Muhammad_Aidil_Fitra_CV.pdf', 'Muhammad Aidil Fitra - Curriculum Vitae\n\nExperience:\n- Full Stack Developer\n- Photographer\n- Creative Director\n\nContact: aidil@example.com');
                }
                
                playClickSound();
            });
        });
    }
    
    function downloadCV(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // Simple typeWriter helper used by dynamic profile windows
    // Untuk saat ini, fungsi ini langsung menuliskan seluruh HTML ke elemen target
    // sehingga tidak menimbulkan error ketika dipanggil dari setProfile.
    function typeWriter(htmlString, targetElement, startIndex) {
        if (!targetElement) return;
        targetElement.innerHTML = htmlString;
    }
    
    // Fake loading screen sebelum membuka link eksternal (mis. Google Drive)
    function showFakeLoading(message, callback) {
        // Jika overlay sedang aktif, abaikan permintaan baru
        if (loadingOverlayActive) return;

        let overlay = document.getElementById('fake-loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'fake-loading-overlay';
            overlay.style.position = 'fixed';
            overlay.style.inset = '0';
            overlay.style.background = 'rgba(0, 0, 0, 0.9)';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.zIndex = '9999';
            overlay.style.color = '#00ff00';
            overlay.style.fontFamily = '"Share Tech Mono", monospace';
            overlay.style.fontSize = '16px';
            overlay.style.textAlign = 'center';
            overlay.style.textShadow = '0 0 6px #00ff00';
            overlay.innerHTML = '' +
                '<div class="terminal-window" style="padding:20px 40px; border:2px solid #00ff00; min-width:260px;">' +
                '  <div class="loading-box" style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; min-height:220px;">' +
                '    <p>LOADING...</p>' +
                '    <div class="loading-bar-outer" style="width:220px; height:8px; border:1px solid #00ff00; padding:1px; box-shadow:0 0 6px #00ff00 inset;">' +
                '      <div class="loading-bar-inner" style="width:0%; height:100%; background:#00ff00;"></div>' +
                '    </div>' +
                '  </div>' +
                '</div>';
            document.body.appendChild(overlay);
        }

        const textEl = overlay.querySelector('.loading-box p');
        if (textEl) {
            textEl.textContent = message || 'MENGHUBUNGKAN KE DRIVE...';
        }

        const barInner = overlay.querySelector('.loading-bar-inner');
        if (barInner) {
            barInner.style.width = '0%';
            let progress = 0;
            const step = 20;
            const interval = setInterval(function () {
                progress += step;
                if (progress > 100) progress = 100;
                barInner.style.width = progress + '%';
                if (progress >= 100) {
                    clearInterval(interval);
                }
            }, 150);
        }

        loadingOverlayActive = true;
        overlay.style.display = 'flex';

        setTimeout(function () {
            overlay.style.display = 'none';
            loadingOverlayActive = false;
            if (typeof callback === 'function') callback();
        }, 1200);
    }

    function setupDigitalDriveLinks(container) {
        if (!container) return;
        const links = container.querySelectorAll('a[data-drive-link="true"]');
        links.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                if (loadingOverlayActive) return;
                const url = this.getAttribute('href');
                if (!url) return;

                // Ambil nama "file" dari teks link (sebelum spasi pertama untuk menjaga gaya terminal)
                const fullText = this.textContent.trim();
                const fileLabel = fullText.split(/\s+/)[0] || 'DRIVE';
                const msg = `MENGHUBUNGKAN (${fileLabel})...`;

                showFakeLoading(msg, function () {
                    window.open(url, '_blank');
                });
            });
        });
    }
    
    // Project detail viewing
    function setupProjectInteractions() {
        // Add terminal-like command input for project viewing
        const terminalContents = document.querySelectorAll('.terminal-content');

        terminalContents.forEach(content => {
            const paragraphs = Array.from(content.querySelectorAll('p'));

            const hasProjectHint = paragraphs.some(p =>
                p.textContent.toLowerCase().includes('view project')
            );

            const hasPhotoHint = paragraphs.some(p =>
                p.textContent.toLowerCase().includes('open photo')
            );

            if (hasProjectHint || hasPhotoHint) {
                addCommandLine(content);
            }
        });
    }
    
    function addCommandLine(container) {
        const commandLine = document.createElement('div');
        commandLine.className = 'command-line';
        commandLine.innerHTML = '<span class="prompt">C:\\></span> <input type="text" class="command-input" />';
        
        container.appendChild(commandLine);
        
        const input = commandLine.querySelector('.command-input');
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const command = this.value.trim().toLowerCase();
                handleCommand(command, container);
                this.value = '';
            }
        });
    }
    
    function handleCommand(command, container) {
        const output = document.createElement('div');
        output.className = 'command-output';

        switch(command) {
            case 'view project01':
            case 'open project01':
                output.innerHTML = '<p>PROJECT01.HTML - Company Website</p><p>Status: Completed</p><p>Tech Stack: HTML, CSS, JavaScript</p><p>Description: Modern responsive website for corporate client</p>';
                break;
            case 'view project02':
            case 'open project02':
            case 'open project cmd':
                output.innerHTML = '<p>PROJECT02.JS - Web Application</p><p>Status: In Progress</p><p>Tech Stack: Node.js, MongoDB</p><p>Description: Full-stack web application with real-time features</p>';
                break;
            case 'open photo_gallery_01':
                output.innerHTML = '<p>PHOTO_GALLERY_01 - Event Photography</p><p>Images: 45 photos</p><p>Event: Tech Conference 2024</p><p>Location: Jakarta Convention Center</p>';
                break;
            default:
                output.innerHTML = `<p>Command not recognized: ${command}</p><p>Type 'help' for available commands</p>`;
        }

        container.appendChild(output);
        playClickSound();
    }

    // Status bar: clock, profile switch, and volume control
    function setupStatusBar() {
        const clockEl = document.getElementById('realtime-clock');
        const profileSwitchBtn = document.getElementById('profile-switch-btn');
        const powerBtn = document.getElementById('power-btn');
        const volumeBtn = document.getElementById('volume-btn');
        const volumeSlider = document.getElementById('volume-slider');
        const volumeRange = document.getElementById('volume-range');
        const volumeIcon = volumeBtn ? volumeBtn.querySelector('.volume-icon') : null;
        const dateTextEl = document.querySelector('.weather-temp');
        const dateIconEl = document.querySelector('.weather-icon');
        const batteryLevelEl = document.querySelector('.battery-level');
        const batteryIconEl = document.querySelector('.battery-icon');

        // Simpan profil aktif saat ini (untuk About & Kontak)
        let currentProfile = null;

        // Real-time clock (12-hour format)
        function updateClock() {
            if (!clockEl) return;
            const now = new Date();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            if (hours === 0) hours = 12; // 0 -> 12 AM/PM

            const h12 = String(hours).padStart(2, '0');
            clockEl.textContent = `${h12}:${minutes}:${seconds} ${ampm}`;
        }

        updateClock();
        setInterval(updateClock, 1000);

        // Tanggal (hari-bulan-tahun) menggunakan locale Indonesia
        function updateDate() {
            if (!dateTextEl) return;
            const now = new Date();
            const options = { day: '2-digit', month: 'long', year: 'numeric' };
            const formatted = now.toLocaleDateString('id-ID', options);
            dateTextEl.textContent = formatted.toUpperCase();

            if (dateIconEl) {
                dateIconEl.textContent = '📅';
            }
        }

        updateDate();
        // Update tiap menit untuk berjaga-jaga lewat pergantian hari
        setInterval(updateDate, 60000);

        // Tombol power: restart (reload) halaman dari awal
        if (powerBtn) {
            powerBtn.addEventListener('click', function() {
                playClickSound();
                location.reload();
            });
        }

        // Fungsi untuk mengganti konten profil di jendela "TENTANG SAYA" dan "KONTAK"
        function setProfile(profile) {
            profileSelected = true;
            hideProfileRequiredWarning();
            const aboutWindow = document.getElementById('about-window');
            if (!aboutWindow) return;
            const aboutText = aboutWindow.querySelector('.terminal-text');
            if (!aboutText) return;

            const contactWindow = document.getElementById('contact-window');
            const contactText = contactWindow ? contactWindow.querySelector('.terminal-text') : null;

            const resumeWindow = document.getElementById('resume-window');
            const resumeText = resumeWindow ? resumeWindow.querySelector('.terminal-text') : null;

            const digitalWindow = document.getElementById('digital-window');
            const digitalText = digitalWindow ? digitalWindow.querySelector('.terminal-text') : null;

            const physicalWindow = document.getElementById('physical-window');
            const physicalText = physicalWindow ? physicalWindow.querySelector('.terminal-text') : null;

            currentProfile = profile;

            // Fake loading singkat setiap kali ganti profil
            showFakeLoading(`MENGHUBUNGKAN PROFIL (${profile.toUpperCase()})...`, function () {

            if (profile === 'andra') {
                // Clear and type with animation
                aboutText.innerHTML = '';
                const content = `
                    <p>The&ensp;Atlantic&ensp;Doers&ensp;-&ensp;Portfolio&ensp;Terminal&ensp;v1.0</p>
                    <p>=====================================</p>
                    <p>PROFIL:&ensp;ANDRA&ensp;KAFKA&ensp;ALETHA</p>
                    <p>Role:&ensp;Desainer&ensp;Grafis,&ensp;Jurnalis</p>
                    <p>=====================================</p>
                    <p>FOTO&ensp;PROFIL:</p>
                    <p><img src="Andra_Profile.png" class="profile-photo" alt="Profil Andra" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"></p>
                    <p><span class="profile-photo profile-placeholder" style="display:none;">ANKATHA</span></p>
                    <p></p>
                    <p>🅰&ensp;PROFIL</p>
                    <p>-------------------------------------</p>
                    <p>Lulusan&ensp;siswa&ensp;SMK&ensp;Negeri&ensp;4&ensp;Bandung&ensp;jurusan&ensp;Desain&ensp;Komunikasi&ensp;Visual&ensp;(DKV)&ensp;dengan&ensp;minat&ensp;yang&ensp;kuat&ensp;di&ensp;bidang&ensp;Desain&ensp;dan&ensp;Jurnalistik.</p>
                    <p>Memiliki&ensp;pengalaman&ensp;dalam&ensp;penelitian&ensp;dan&ensp;perlombaan&ensp;tingkat&ensp;nasionaI,&ensp;dibuktikan&ensp;dengan&ensp;prestasi&ensp;sebagai&ensp;finalis&ensp;Ngide&ensp;Bandung,</p>
                    <p>peraih&ensp;medali&ensp;emas&ensp;di&ensp;Hatta&ensp;Youth&ensp;Student&ensp;Olympiad&ensp;Bahasa&ensp;Indonesia&ensp;tingkat&ensp;SMA/SMK,&ensp;dan&ensp;Gadjah&ensp;Mada&ensp;Student&ensp;Competition&ensp;PKN&ensp;tingkat&ensp;SMA/SMK.</p>
                    <p></p>
                    <p>🅱&ensp;KEAHLlAN&ensp;UTAMA</p>
                    <p>-------------------------------------</p>
                    <p>-&ensp;Desain&ensp;Grafis</p>
                    <p>-&ensp;Menguasai&ensp;software&ensp;desain&ensp;(Adobe&ensp;Photoshop,&ensp;Illustrator,&ensp;dan&ensp;Canva)</p>
                    <p>-&ensp;Menguasai&ensp;software&ensp;editing&ensp;(Adobe&ensp;After&ensp;Effect,&ensp;dan&ensp;Capcut)</p>
                    <p>-&ensp;Menguasai&ensp;software&ensp;3D&ensp;Animasi&ensp;(Blender)</p>
                    <p>-&ensp;Menguasai&ensp;software&ensp;2D&ensp;Animasi&ensp;(Adobe&ensp;After&ensp;Effect)</p>
                    <p></p>
                    <p>🅲&ensp;SOCIAL&ensp;LINKS</p>
                    <p>-------------------------------------</p>
                    <p>-&ensp;Instagram:&ensp;@Ankatha07</p>
                    <p>-&ensp;Instagram:&ensp;@Ankatha_Production</p>
                    <p></p>
                    <p>🅳&ensp;KONTAK</p>
                    <p>-------------------------------------</p>
                    <p>-&ensp;No.&ensp;HP:&ensp;0881-0230-78538</p>
                    <p>-&ensp;Email:&ensp;picaprosa@gmail.com</p>
                `;
                typeWriter(content, aboutText, 0);

                if (contactText) {
                    contactText.innerHTML = `
                        <p>The&ensp;Atlantic&ensp;Doers&ensp;-&ensp;Contact&ensp;Information</p>
                        <p>=====================================</p>
                        <p>Nama:&ensp;Andra&ensp;Kafka&ensp;Aletha</p>
                        <p>Email:&ensp;picaprosa@gmail.com</p>
                        <p>Phone:&ensp;0881-0230-78538</p>
                    `;
                }

                if (resumeText) {
                    resumeText.innerHTML = `
                        <p>The&ensp;Atlantic&ensp;Doers&ensp;-&ensp;Resume&ensp;Download</p>
                        <p>=====================================</p>
                        <p>Available&ensp;CV&ensp;Files:</p>
                        <p>1.&ensp;Andra_Kafka_Aletha_CV.pdf&ensp;[245KB]</p>
                        <p></p>
                        <p><a href="#" class="download-link" data-file="andra_cv">[&ensp;DOWNLOAD&ensp;CV&ensp;ANDRA&ensp;]</a></p>
                        <p></p>
                        <p><button class="resume-preview-btn" data-profile="andra">[&ensp;LIHAT&ensp;PREVIEW&ensp;RESUME&ensp;]</button></p>
                        <div class="resume-preview resume-preview-andra hidden">
                            <p></p>
                            <p>RESUME&ensp;PREVIEW:</p>
                            <p><img src="Andra_Resume.jpg" alt="Andra Resume" class="profile-photo andra-resume"></p>
                        </div>
                        <p></p>
                        <p>Profil&ensp;aktif:&ensp;Andra&ensp;Kafka&ensp;Aletha</p>
                        <p>Role:&ensp;Web&ensp;Developer,&ensp;UI/UX&ensp;Designer,&ensp;Digital&ensp;Artist</p>
                    `;
                    setupDownloadLinks();

                    const btn = resumeText.querySelector('.resume-preview-btn[data-profile="andra"]');
                    const box = resumeText.querySelector('.resume-preview-andra');
                    if (btn && box) {
                        btn.addEventListener('click', function () {
                            box.classList.toggle('hidden');
                        });
                    }
                }

                if (digitalText) {
                    digitalText.innerHTML = `
                        <p>The&ensp;Atlantic&ensp;Doers&ensp;-&ensp;Digital&ensp;Portfolio</p>
                        <p>=====================================</p>
                        <p>DIRECTORY&ensp;LISTING&ensp;(ANDRA):</p>
                        <p><a href="https://drive.google.com/drive/folders/1WuSWOt6jUrIkC5ImFrJUSkge2D0YkqNM?usp=sharing" target="_blank" data-drive-link="true">FEED_ARTICLE.DRV&ensp;[GDRIVE]&ensp;-&ensp;Feed&ensp;Article</a></p>
                        <p><a href="https://drive.google.com/drive/folders/1pvVqh5ymSu8PHcHyutJIFlxJc45VobMN?usp=sharing" target="_blank" data-drive-link="true">POSTER_SERIES.DRV&ensp;[GDRIVE]&ensp;-&ensp;Poster&ensp;Design</a></p>
                        <p><a href="https://drive.google.com/drive/folders/1KSZ9Z4oysoCxkBYTbdSPzgM4g4_LwnMV?usp=sharing" target="_blank" data-drive-link="true">INFOGRAPHICS.DRV&ensp;[GDRIVE]&ensp;-&ensp;Infografis</a></p>
                        <p><a href="https://drive.google.com/drive/folders/1oOaY45bZzlXDZBrxwI8pYQXb4EU9Nvp3?usp=sharing" target="_blank" data-drive-link="true">VIDEO_REELS.DRV&ensp;[GDRIVE]&ensp;-&ensp;Video&ensp;Content</a></p>
                        <p><a href="https://drive.google.com/drive/folders/18te4WfP16JGCtv7DUxonoVPdXJe4H0oK?usp=drive_link" target="_blank" data-drive-link="true">ANIMATION_2D3D.DRV&ensp;[GDRIVE]&ensp;-&ensp;Animasi&ensp;2D/3D</a></p>
                        <p></p>
                        <p>Fokus:&ensp;desain&ensp;antarmuka,&ensp;front-end,&ensp;dan&ensp;eksplorasi&ensp;visual&ensp;digital.</p>
                    `;
                    setupDigitalDriveLinks(digitalText);
                }

                if (physicalText) {
                    physicalText.innerHTML = `
                        <p>The&ensp;Atlantic&ensp;Doers&ensp;-&ensp;Physical&ensp;Portfolio</p>
                        <p>=====================================</p>
                        <p>DIRECTORY&ensp;LISTING&ensp;(ANDRA):</p>
                        <p><a href="https://drive.google.com/drive/folders/1_BAqzN5QEkiBEQCX4V9ashWiRGkW6t36?usp=sharing" target="_blank" data-physical-andra="true">CORETAN_FISIK.DRV&ensp;[GDRIVE]&ensp;-&ensp;Coretan&ensp;Fisik</a></p>
                        <p></p>
                        <p>Fokus:&ensp;sketsa&ensp;dan&ensp;karya&ensp;fisik&ensp;lainnya&ensp;yang&ensp;menjadi&ensp;dasar&ensp;eksplorasi&ensp;visual.</p>
                    `;

                    const link = physicalText.querySelector('a[data-physical-andra="true"]');
                    if (link) {
                        link.addEventListener('click', function (e) {
                            e.preventDefault();
                            const url = this.getAttribute('href');
                            if (!url) return;
                            showFakeLoading('MENGHUBUNGKAN (CORETAN_FISIK.DRV)...', function () {
                                window.open(url, '_blank');
                            });
                        });
                    }
                }
            } else if (profile === 'aidil') {
                // Clear and type with animation
                aboutText.innerHTML = '';
                const content = `
                    <p>The&ensp;Atlantic&ensp;Doers&ensp;-&ensp;Portfolio&ensp;Terminal&ensp;v1.0</p>
                    <p>=====================================</p>
                    <p>Profil:&ensp;Muhammad&ensp;Aidil&ensp;Fitra</p>
                    <p>Role:&ensp;UI/UX&ensp;Designer&ensp;Creative&ensp;Director</p>
                    <p>=====================================</p>
                    <p>FOTO&ensp;PROFIL:</p>
                    <p><span class="profile-photo profile-placeholder">AIDIL</span></p>
                    <p></p>
                    <p>🅰&ensp;PROFIL</p>
                    <p>-------------------------------------</p>
                    <p>Lulusan&ensp;SMK&ensp;N&ensp;4&ensp;Bandung&ensp;jurusan&ensp;Desain&ensp;Komunikasi&ensp;Visual&ensp;(DKV)&ensp;dengan&ensp;minat&ensp;yang&ensp;kuat&ensp;di&ensp;bidang&ensp;desain&ensp;dan&ensp;organisasi.</p>
                    <p>Memiliki&ensp;pengalaman&ensp;sebagai&ensp;juara&ensp;satu&ensp;lomba&ensp;desain&ensp;poster&ensp;yang&ensp;diselenggarakan&ensp;oleh&ensp;Universitas&ensp;Persatuan&ensp;Islam</p>
                    <p>serta&ensp;menjadi&ensp;salah&ensp;satu&ensp;finalis&ensp;lomba&ensp;enterpreneurship&ensp;yang&ensp;diselenggarakan&ensp;oleh&ensp;SMA&ensp;Negeri&ensp;1&ensp;Bandung.</p>
                    <p>Aidil&ensp;juga&ensp;berfokus&ensp;pada&ensp;pengembangan&ensp;keahlian&ensp;di&ensp;bidang&ensp;desain&ensp;grafis,&ensp;fotografi,&ensp;digital&ensp;marketing,&ensp;dan&ensp;public&ensp;speaking.</p>
                    <p></p>
                    <p>🅱&ensp;KEAHLlAN&ensp;UTAMA</p>
                    <p>-------------------------------------</p>
                    <p>Keahlian&ensp;utama:</p>
                    <p>-&ensp;Penggunaan&ensp;Figma</p>
                    <p>-&ensp;Penggunaan&ensp;Photoshop</p>
                    <p>-&ensp;Penggunaan&ensp;Lightroom</p>
                    <p>-&ensp;Penggunaan&ensp;After&ensp;Effect</p>
                    <p>-&ensp;Penggunaan&ensp;Creative&ensp;Direction</p>
                    <p>-&ensp;Fotografi</p>
                    <p></p>
                    <p>🅲&ensp;SOCIAL&ensp;LINKS</p>
                    <p>-------------------------------------</p>
                    <p>Social&ensp;Links:</p>
                    <p>-&ensp;Instagram:&ensp;@dielusi_hirsa</p>
                    <p>-&ensp;Instagram:&ensp;@dielll_iel</p>
                    <p>-&ensp;Instagram:&ensp;@dielll_lius</p>
                    <p></p>
                    <p>🅳&ensp;KONTAK</p>
                    <p>-------------------------------------</p>
                    <p>Kontak:</p>
                    <p>-&ensp;No.&ensp;HP:&ensp;0838-9511-5982</p>
                    <p>-&ensp;Email:&ensp;fmaidil33@gmail.com</p>
                `;
                typeWriter(content, aboutText, 0);

                if (contactText) {
                    contactText.innerHTML = `
                        <p>The&ensp;Atlantic&ensp;Doers&ensp;-&ensp;Contact&ensp;Information</p>
                        <p>=====================================</p>
                        <p>Nama:&ensp;Muhammad&ensp;Aidil&ensp;Fitra</p>
                        <p>Email:&ensp;fmaidil33@gmail.com</p>
                        <p>Phone:&ensp;0838-9511-5982</p>
                    `;
                }

                if (resumeText) {
                    resumeText.innerHTML = `
                        <p>The&ensp;Atlantic&ensp;Doers&ensp;-&ensp;Resume&ensp;Download</p>
                        <p>=====================================</p>
                        <p>Available&ensp;CV&ensp;Files:</p>
                        <p>1.&ensp;Muhammad_Aidil_Fitra_CV.pdf&ensp;[198KB]</p>
                        <p></p>
                        <p><a href="#" class="download-link" data-file="aidil_cv">[&ensp;DOWNLOAD&ensp;CV&ensp;AIDIL&ensp;]</a></p>
                        <p></p>
                        <p><button class="resume-preview-btn" data-profile="aidil">[&ensp;LIHAT&ensp;PREVIEW&ensp;RESUME&ensp;]</button></p>
                        <div class="resume-preview resume-preview-aidil hidden">
                            <p></p>
                            <p>RESUME&ensp;PREVIEW:</p>
                            <p><img src="Aidil_Resume.png" alt="Aidil Resume" class="profile-photo aidil-resume"></p>
                        </div>
                        <p></p>
                        <p>Profil&ensp;aktif:&ensp;Muhammad&ensp;Aidil&ensp;Fitra</p>
                        <p>Role:&ensp;UI/UX&ensp;Designer,&ensp;Creative&ensp;Director</p>
                    `;
                    setupDownloadLinks();

                    const btn = resumeText.querySelector('.resume-preview-btn[data-profile="aidil"]');
                    const box = resumeText.querySelector('.resume-preview-aidil');
                    if (btn && box) {
                        btn.addEventListener('click', function () {
                            box.classList.toggle('hidden');
                        });
                    }
                }

                if (digitalText) {
                    digitalText.innerHTML = `
                        <p>The&ensp;Atlantic&ensp;Doers&ensp;-&ensp;Digital&ensp;Portfolio</p>
                        <p>=====================================</p>
                        <p>DIRECTORY&ensp;LISTING&ensp;(AIDIL):</p>
                        <p>FEED_ARTICLE.DRV&ensp;[N/A]&ensp;-&ensp;Belum&ensp;tersedia</p>
                        <p>POSTER_SERIES.DRV&ensp;[N/A]&ensp;-&ensp;Belum&ensp;tersedia</p>
                        <p>INFOGRAPHICS.DRV&ensp;[N/A]&ensp;-&ensp;Belum&ensp;tersedia</p>
                        <p>VIDEO_REELS.DRV&ensp;[N/A]&ensp;-&ensp;Belum&ensp;tersedia</p>
                        <p>ANIMATION_2D3D.DRV&ensp;[N/A]&ensp;-&ensp;Belum&ensp;tersedia</p>
                        <p></p>
                        <p>Fokus:&ensp;sistem&ensp;end-to-end,&ensp;backend,&ensp;dan&ensp;eksplorasi&ensp;fotografi&ensp;digital.</p>
                    `;
                }

                if (physicalText) {
                    physicalText.innerHTML = `
                        <p>The&ensp;Atlantic&ensp;Doers&ensp;-&ensp;Physical&ensp;Portfolio</p>
                        <p>=====================================</p>
                        <p>DIRECTORY&ensp;LISTING&ensp;(AIDIL):</p>
                        <p>CORETAN_FISIK.DRV&ensp;[N/A]&ensp;-&ensp;Belum&ensp;tersedia</p>
                        <p></p>
                        <p>Fokus:&ensp;fotografi,&ensp;instalasi&ensp;visual,&ensp;dan&ensp;dokumentasi&ensp;kreatif.</p>
                    `;
                }
            }

            }); // end showFakeLoading callback
        }

        // Saat tombol profil di samping jam diklik, buka jendela dan tampilkan menu pilihan profil
        if (profileSwitchBtn) {
            profileSwitchBtn.addEventListener('click', function() {
                const aboutWindow = document.getElementById('about-window');
                if (!aboutWindow) return;
                const aboutText = aboutWindow.querySelector('.terminal-text');
                if (!aboutText) return;

                aboutWindow.classList.remove('hidden');
                aboutText.innerHTML = `
                    <p>The&ensp;Atlantic&ensp;Doers&ensp;-&ensp;Portfolio&ensp;Terminal&ensp;v1.0</p>
                    <p>=====================================</p>
                    <p>Pilih&ensp;profil&ensp;untuk&ensp;ditampilkan:</p>
                    <p></p>
                    <p><button class="profile-select" data-profile="andra">[&ensp;PROFIL&ensp;ANDRA&ensp;]</button></p>
                    <p><button class="profile-select" data-profile="aidil">[&ensp;PROFIL&ensp;AIDIL&ensp;]</button></p>
                    <p></p>
                    <p>Gunakan&ensp;tombol&ensp;di&ensp;atas&ensp;untuk&ensp;melihat&ensp;detail&ensp;masing-masing&ensp;profil.</p>
                `;

                playClickSound();
            });

            // Delegasi event klik di dalam about-window untuk menangani tombol profile-select
            const aboutWindow = document.getElementById('about-window');
            if (aboutWindow) {
                aboutWindow.addEventListener('click', function(e) {
                    const btn = e.target.closest('.profile-select');
                    if (!btn) return;
                    const profile = btn.getAttribute('data-profile');
                    setProfile(profile);
                    playClickSound();
                });
            }
        }

        // Volume control popup
        if (volumeBtn && volumeSlider && volumeRange) {
            volumeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                volumeSlider.classList.toggle('hidden');
                playClickSound();
            });

            document.addEventListener('click', function(e) {
                if (!volumeSlider.classList.contains('hidden') && !volumeSlider.contains(e.target) && e.target !== volumeBtn) {
                    volumeSlider.classList.add('hidden');
                }
            });

            function updateVolumeIcon(v) {
                if (!volumeIcon) return;
                const vol = Number(v);
                if (vol === 0) {
                    volumeIcon.textContent = '🔇';
                } else if (vol < 50) {
                    volumeIcon.textContent = '🔈';
                } else if (vol < 80) {
                    volumeIcon.textContent = '🔉';
                } else {
                    volumeIcon.textContent = '🔊';
                }
            }

            updateVolumeIcon(volumeRange.value);

            volumeRange.addEventListener('input', function() {
                updateVolumeIcon(this.value);
            });
        }

        // Easter egg: klik ikon baterai 5x untuk memicu efek "virus" lalu restart
        if (batteryIconEl) {
            let batteryClickCount = 0;
            let lastClickTime = 0;

            batteryIconEl.addEventListener('click', function() {
                const now = Date.now();
                // Reset hitungan jika jeda terlalu lama (>3 detik)
                if (now - lastClickTime > 3000) {
                    batteryClickCount = 0;
                }
                lastClickTime = now;
                batteryClickCount++;

                if (batteryClickCount >= 5) {
                    batteryClickCount = 0;

                    let overlay = document.getElementById('virus-overlay');
                    if (!overlay) {
                        overlay = document.createElement('div');
                        overlay.id = 'virus-overlay';
                        overlay.style.position = 'fixed';
                        overlay.style.inset = '0';
                        overlay.style.background = 'rgba(0,0,0,0.95)';
                        overlay.style.zIndex = '10002';
                        overlay.style.display = 'flex';
                        overlay.style.alignItems = 'center';
                        overlay.style.justifyContent = 'center';
                        overlay.style.color = '#00ff00';
                        overlay.style.fontFamily = '"Share Tech Mono", monospace';
                        overlay.style.textAlign = 'center';
                        overlay.style.textShadow = '0 0 6px #00ff00';

                        overlay.innerHTML = '' +
                            '<div class="terminal-window virus-box" style="padding:24px 40px; border:2px solid #00ff00; max-width:520px; box-shadow:0 0 12px rgba(0,255,0,0.7);">' +
                            '  <p class="virus-text-heading virus-text">SYSTEM&ensp;ALERT:</p>' +
                            '  <p>==============================</p>' +
                            '  <p class="virus-text">MALWARE&ensp;KRITIS&ensp;TERDETEKSI.</p>' +
                            '  <p class="virus-text">DATA&ensp;VISUAL&ensp;DAN&ensp;PROSES&ensp;SISTEM&ensp;TERKONTAMINASI.</p>' +
                            '  <p class="virus-text">FORCED&ensp;REBOOT&ensp;DILAKSANAKAN&ensp;UNTUK&ensp;MENGHENTIKAN&ensp;PENYEBARAN.</p>' +
                            '  <p class="virus-text">ERROR&ensp;CODE:&ensp;0x5150</p>' +
                            '  <p>==============================</p>' +
                            '</div>';

                        document.body.appendChild(overlay);
                    }

                    overlay.style.display = 'flex';

                    // Siapkan teks asli untuk efek glitch karakter
                    const virusTextEls = Array.from(overlay.querySelectorAll('.virus-text'));
                    const virusOriginal = virusTextEls.map(el => el.textContent);
                    const glitchChars = ['#', '%', '&', '@', 'X', '0', '1', '[', ']', '*'];

                    const virusBox = overlay.querySelector('.virus-box');

                    // Efek glitch: goyangkan overlay, kedipkan background, dan acak beberapa karakter teks
                    let ticks = 0;
                    const glitchInterval = setInterval(function() {
                        ticks++;
                        const dx = (Math.random() - 0.5) * 14;
                        const dy = (Math.random() - 0.5) * 8;
                        const bgAlpha = 0.85 + (Math.random() * 0.1);
                        overlay.style.transform = `translate(${dx}px, ${dy}px)`;
                        overlay.style.background = `rgba(0,0,0,${bgAlpha})`;

                        // Glitch outline kotak: ubah bayangan & ketebalan semu
                        if (virusBox) {
                            const glow = 0.6 + Math.random() * 0.6;
                            virusBox.style.boxShadow = `0 0 ${10 + Math.random()*14}px rgba(0,255,0,${glow})`;
                            virusBox.style.borderColor = Math.random() < 0.5 ? '#00ff00' : '#55ff55';
                        }

                        // Glitch teks dengan mengganti sebagian karakter secara acak
                        virusTextEls.forEach((el, idx) => {
                            const base = virusOriginal[idx] || '';
                            const chars = base.split('');
                            for (let i = 0; i < chars.length; i++) {
                                if (Math.random() < 0.15 && chars[i] !== ' ' && chars[i] !== '&') {
                                    chars[i] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                                }
                            }
                            el.textContent = chars.join('');
                        });

                        if (ticks > 18) {
                            clearInterval(glitchInterval);
                            overlay.style.transform = 'translate(0,0)';
                            overlay.style.background = 'rgba(0,0,0,0.95)';
                            if (virusBox) {
                                virusBox.style.boxShadow = '0 0 12px rgba(0,255,0,0.7)';
                                virusBox.style.borderColor = '#00ff00';
                            }
                            // Kembalikan teks asli setelah glitch selesai
                            virusTextEls.forEach((el, idx) => {
                                el.textContent = virusOriginal[idx] || '';
                            });
                        }
                    }, 70);

                    // Putar suara error / glitch
                    playErrorGlitchSound();

                    setTimeout(function() {
                        location.reload();
                    }, 2000);
                }
            });
        }

        // Battery status (jika browser mendukung Battery Status API)
        if (batteryLevelEl && navigator.getBattery) {
            navigator.getBattery().then(function(battery) {
                function updateBattery() {
                    const level = Math.round(battery.level * 100);
                    batteryLevelEl.textContent = level + '%';

                    if (!batteryIconEl) return;
                    if (level <= 5) {
                        batteryIconEl.textContent = '🟥';
                    } else if (level <= 20) {
                        batteryIconEl.textContent = '🔋';
                    } else if (level <= 50) {
                        batteryIconEl.textContent = '🔋';
                    } else if (level <= 80) {
                        batteryIconEl.textContent = '🔋';
                    } else {
                        batteryIconEl.textContent = '🔋';
                    }
                }

                updateBattery();
                battery.addEventListener('levelchange', updateBattery);
                battery.addEventListener('chargingchange', updateBattery);
            }).catch(function() {
                // Jika gagal (misalnya diblokir), biarkan teks baterai statis
            });
        }
    }

    // Upload functionality
    function setupImageUpload() {
        const imageUpload = document.getElementById('imageUpload');
        const uploadPreview = document.getElementById('uploadPreview');
        const uploadBtn = document.querySelector('.upload-btn');
        
        if (uploadBtn && imageUpload) {
            uploadBtn.addEventListener('click', function() {
                imageUpload.click();
            });
        }
        
        if (imageUpload && uploadPreview) {
            imageUpload.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.maxWidth = '100%';
                        img.style.maxHeight = '150px';
                        img.style.border = '2px solid #00ff00';
                        img.style.margin = '5px 0';
                        
                        uploadPreview.innerHTML = '';
                        uploadPreview.appendChild(img);
                        
                        // Add file info
                        const fileInfo = document.createElement('p');
                        fileInfo.style.fontSize = '14px';
                        fileInfo.style.color = '#00ff00';
                        fileInfo.innerHTML = `File: ${file.name} [${Math.round(file.size/1024)}KB]`;
                        uploadPreview.appendChild(fileInfo);
                        
                        playClickSound();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    // Drag and Drop functionality for icons
    function setupDragAndDrop() {
        const icons = document.querySelectorAll('.icon');
        
        icons.forEach((icon) => {
            let isDragging = false;
            let offsetX, offsetY;
            let startX, startY;
            
            icon.style.cursor = 'grab';
            
            icon.addEventListener('mousedown', function(e) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                
                const rect = icon.getBoundingClientRect();
                const desktopRect = document.querySelector('.desktop').getBoundingClientRect();
                
                offsetX = startX - rect.left;
                offsetY = startY - rect.top;
                
                this.style.transform = 'none';
                this.style.left = (rect.left - desktopRect.left) + 'px';
                this.style.top = (rect.top - desktopRect.top) + 'px';
                
                this.style.cursor = 'grabbing';
                this.style.zIndex = '1000';
                this.style.opacity = '0.7';
                
                e.preventDefault();
                e.stopPropagation();
            });
            
            document.addEventListener('mousemove', function(e) {
                if (!isDragging) return;
                
                const newX = e.clientX - offsetX;
                const newY = e.clientY - offsetY;
                
                const desktop = document.querySelector('.desktop');
                const desktopRect = desktop.getBoundingClientRect();
                const maxX = desktopRect.width - icon.offsetWidth;
                const maxY = desktopRect.height - icon.offsetHeight;
                
                const finalX = Math.max(0, Math.min(newX, maxX));
                const finalY = Math.max(0, Math.min(newY, maxY));
                
                icon.style.left = finalX + 'px';
                icon.style.top = finalY + 'px';
            });
            
            document.addEventListener('mouseup', function() {
                if (isDragging) {
                    isDragging = false;
                    icon.style.cursor = 'grab';
                    icon.style.zIndex = '10';
                    icon.style.opacity = '1';
                    playClickSound();
                }
            });
        });
    }

    // Window dragging functionality
    function setupWindowDragging() {
        const windows = document.querySelectorAll('.terminal-window');
        
        windows.forEach(window => {
            const header = window.querySelector('.window-header');
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;
            
            // Untuk kebanyakan jendela, mulai dari tengah layar.
            // Khusus calculator & minesweeper, biarkan CSS yang menentukan posisi awal di pojok.
            if (window.id !== 'calculator-window' && window.id !== 'minesweeper-window') {
                window.style.position = 'fixed';
                window.style.left = '50%';
                window.style.top = '50%';
                window.style.transform = 'translate(-50%, -50%)';
            }
            
            header.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
            
            function dragStart(e) {
                if (e.target.classList.contains('close-btn')) return;
                
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                
                if (e.target === header || header.contains(e.target)) {
                    isDragging = true;
                    window.classList.add('dragging');
                    header.classList.add('dragging');
                    
                    window.style.transform = 'none';
                }
            }
            
            function drag(e) {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    
                    xOffset = currentX;
                    yOffset = currentY;
                    
                    window.style.left = (currentX + window.offsetWidth / 2) + 'px';
                    window.style.top = (currentY + window.offsetHeight / 2) + 'px';
                }
            }
            
            function dragEnd() {
                initialX = currentX;
                initialY = currentY;
                
                isDragging = false;
                window.classList.remove('dragging');
                header.classList.remove('dragging');
            }
        });
    }

    // Calculator widget (jendela)
    function setupCalculator() {
        const display = document.getElementById('calc-display');
        const buttonsContainer = document.querySelector('#calculator-window .calc-buttons');

        if (!display || !buttonsContainer) return;

        let current = '';

        function updateDisplay(value) {
            display.value = value;
        }

        function handleKey(key) {
            if (key === 'C') {
                current = '';
                updateDisplay('');
                return;
            }

            if (key === '=') {
                if (!current) return;
                try {
                    const sanitized = current.replace(/[^0-9+\-*/.]/g, '');
                    // eslint-disable-next-line no-eval
                    const result = eval(sanitized);
                    current = String(result);
                    updateDisplay(current);
                } catch (e) {
                    current = '';
                    updateDisplay('ERROR');
                }
                return;
            }

            const isOperator = ['+', '-', '*', '/'].includes(key);
            const lastChar = current.slice(-1);
            if (isOperator && ['+', '-', '*', '/'].includes(lastChar)) {
                current = current.slice(0, -1) + key;
            } else {
                current += key;
            }

            updateDisplay(current);
        }

        buttonsContainer.addEventListener('click', function(e) {
            const btn = e.target.closest('button[data-key]');
            if (!btn) return;
            const key = btn.getAttribute('data-key');
            handleKey(key);
            playClickSound();
        });
    }

    // Minesweeper widget (vertikal, jendela)
    function setupMinesweeper() {
        const gridEl = document.getElementById('mines-grid');
        const minesRemainingEl = document.getElementById('mines-remaining');
        const resetBtn = document.getElementById('mines-reset');

        if (!gridEl || !minesRemainingEl || !resetBtn) return;

        const rows = 8;
        const cols = 4; // papan ramping (vertikal)
        const totalCells = rows * cols;
        const totalMines = 6;

        let cells = [];
        let gameOver = false;
        let revealedCount = 0;
        let flags = 0;

        function initBoard() {
            gridEl.innerHTML = '';
            cells = [];
            gameOver = false;
            revealedCount = 0;
            flags = 0;

            const minePositions = new Set();
            while (minePositions.size < totalMines) {
                const idx = Math.floor(Math.random() * totalCells);
                minePositions.add(idx);
            }

            for (let i = 0; i < totalCells; i++) {
                const cell = document.createElement('div');
                cell.className = 'mine-cell';
                cell.dataset.index = i;
                cell.innerHTML = '<span></span>';

                const isMine = minePositions.has(i);
                cells.push({
                    el: cell,
                    isMine,
                    revealed: false,
                    flagged: false,
                    adjacent: 0
                });

                gridEl.appendChild(cell);
            }

            function getNeighbors(index) {
                const r = Math.floor(index / cols);
                const c = index % cols;
                const neighbors = [];

                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                            neighbors.push(nr * cols + nc);
                        }
                    }
                }
                return neighbors;
            }

            cells.forEach((cell, idx) => {
                if (cell.isMine) return;
                const neighbors = getNeighbors(idx);
                let count = 0;
                neighbors.forEach(nIdx => {
                    if (cells[nIdx].isMine) count++;
                });
                cell.adjacent = count;
            });

            minesRemainingEl.textContent = 'Mines: ' + totalMines;

            cells.forEach((cell, idx) => {
                cell.el.addEventListener('click', function() {
                    if (gameOver) return;
                    handleReveal(idx);
                    playClickSound();
                });

                cell.el.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    if (gameOver) return;
                    handleFlag(idx);
                    playClickSound();
                });
            });

            gridEl.addEventListener('contextmenu', function(e) {
                e.preventDefault();
            });
        }

        function updateMinesRemaining() {
            const remaining = Math.max(totalMines - flags, 0);
            minesRemainingEl.textContent = 'Mines: ' + remaining;
        }

        function handleFlag(index) {
            const cell = cells[index];
            if (cell.revealed) return;

            cell.flagged = !cell.flagged;
            const span = cell.el.querySelector('span');
            if (cell.flagged) {
                cell.el.classList.add('flagged');
                span.textContent = 'F';
                flags++;
            } else {
                cell.el.classList.remove('flagged');
                span.textContent = '';
                flags--;
            }
            updateMinesRemaining();
        }

        function handleReveal(index) {
            const cell = cells[index];
            if (cell.revealed || cell.flagged) return;

            cell.revealed = true;
            cell.el.classList.add('revealed');
            const span = cell.el.querySelector('span');

            if (cell.isMine) {
                cell.el.classList.add('mine');
                span.textContent = '*';
                endGame(false);
                return;
            }

            revealedCount++;

            if (cell.adjacent > 0) {
                span.textContent = cell.adjacent;
            } else {
                span.textContent = '';
                floodReveal(index);
            }

            checkWin();
        }

        function floodReveal(index) {
            const queue = [index];
            const visited = new Set();

            function getNeighborsLocal(i) {
                const r = Math.floor(i / cols);
                const c = i % cols;
                const neighbors = [];

                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                            neighbors.push(nr * cols + nc);
                        }
                    }
                }
                return neighbors;
            }

            while (queue.length > 0) {
                const current = queue.shift();
                if (visited.has(current)) continue;
                visited.add(current);

                const cell = cells[current];
                if (cell.revealed || cell.isMine) continue;

                cell.revealed = true;
                cell.el.classList.add('revealed');
                const span = cell.el.querySelector('span');

                if (cell.adjacent > 0) {
                    span.textContent = cell.adjacent;
                    revealedCount++;
                } else {
                    span.textContent = '';
                    revealedCount++;
                    const neighbors = getNeighborsLocal(current);
                    neighbors.forEach(n => {
                        if (!visited.has(n)) queue.push(n);
                    });
                }
            }
        }

        function endGame(won) {
            gameOver = true;
            cells.forEach(cell => {
                if (cell.isMine) {
                    const span = cell.el.querySelector('span');
                    cell.el.classList.add('mine');
                    span.textContent = '*';
                }
                cell.el.classList.add('disabled');
            });

            if (won) {
                minesRemainingEl.textContent = 'WIN!';
            } else {
                minesRemainingEl.textContent = 'GAME OVER';
            }
        }

        function checkWin() {
            if (gameOver) return;
            if (revealedCount === totalCells - totalMines) {
                endGame(true);
            }
        }

        resetBtn.addEventListener('click', function() {
            initBoard();
            playClickSound();
        });

        initBoard();
    }

    // Initialize everything
    bootSequence();
    setupDesktopIcons();
    setupCloseButtons();
    setupDownloadLinks();
    setupProjectInteractions();
    setupImageUpload();
    setupDragAndDrop();
    setupWindowDragging();
    setupStatusBar();
    setupCalculator();
    setupMinesweeper();

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openWindows = document.querySelectorAll('.terminal-window:not(.hidden)');
            openWindows.forEach(window => {
                window.classList.add('hidden');
            });
        }

        if (e.ctrlKey && e.altKey && e.key === 'Delete') {
            location.reload();
        }
    });

    // Add CRT flicker effect periodically
    setInterval(() => {
        document.body.style.opacity = '0.95';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 50);
    }, 5000);
});

