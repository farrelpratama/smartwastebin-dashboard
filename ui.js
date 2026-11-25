const UI = {
  elements: {
    connDot: document.getElementById('connDot'),
    connText: document.getElementById('connText'),
    alertBanner: document.getElementById('alertBanner'),
    capacityValue: document.getElementById('capacityValue'),
    capacityBar: document.getElementById('capacityBar'),
    binStatusBadge: document.getElementById('binStatusBadge'),
    binStatusDesc: document.getElementById('binStatusDesc'),
    lidStatusBadge: document.getElementById('lidStatusBadge'),
    logBox: document.getElementById('logBox'),
    lastUpdate: document.getElementById('lastUpdate')
  },

  setConnectionState(status, text) {
    this.elements.connDot.className = `dot ${status}`;
    this.elements.connText.textContent = text;
  },

  addLog(message) {
    const now = new Date().toLocaleTimeString('id-ID');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="log-time">[${now}]</span> ${message}`;
    this.elements.logBox.prepend(entry);

    if (this.elements.logBox.children.length > 30) {
      this.elements.logBox.removeChild(this.elements.logBox.lastChild);
    }
  },

  updateDashboard(data) {
    const kapasitas = Math.min(Math.max(Number(data.kapasitas) || 0, 0), 100);
    this.elements.capacityValue.textContent = `${kapasitas}%`;
    this.elements.capacityBar.style.width = `${kapasitas}%`;

    if (kapasitas >= 85) {
      this.elements.capacityBar.style.backgroundColor = 'var(--accent-red)';
    } else if (kapasitas >= 60) {
      this.elements.capacityBar.style.backgroundColor = 'var(--accent-yellow)';
    } else {
      this.elements.capacityBar.style.backgroundColor = 'var(--accent-green)';
    }

    const isPenuh = Boolean(data.penuh);
    if (isPenuh) {
      this.elements.binStatusBadge.textContent = 'PENUH (LOCKED)';
      this.elements.binStatusBadge.className = 'status-pill status-full';
      this.elements.binStatusDesc.textContent = 'Tong penuh. Tutup dikunci agar sampah tidak meluap.';
      this.elements.alertBanner.style.display = 'block';
    } else {
      this.elements.binStatusBadge.textContent = 'TERSEDIA';
      this.elements.binStatusBadge.className = 'status-pill status-ok';
      this.elements.binStatusDesc.textContent = 'Tong siap digunakan untuk menampung sampah.';
      this.elements.alertBanner.style.display = 'none';
    }

    const statusTutup = String(data.tutup || 'TERTUTUP').toUpperCase();
    this.elements.lidStatusBadge.textContent = statusTutup;
    this.elements.lidStatusBadge.className =
      statusTutup === 'TERBUKA' ? 'status-pill status-open' : 'status-pill status-closed';

    this.elements.lastUpdate.textContent = `Pembaruan terakhir: ${new Date().toLocaleTimeString('id-ID')}`;
  }
};