export type TToastType = 'success' | 'error' | 'warning' | 'info';

export const toast = {
  show: (message: string, type: TToastType = 'info', duration = 3000) => {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toastElement = document.createElement('div');

    const colorClasses = {
      error: 'alert-error',
      info: 'alert-info',
      success: 'alert-success',
      warning: 'alert-warning',
    };

    toastElement.className = `alert ${colorClasses[type]} shadow-lg mb-2 flex items-center gap-3 min-w-[300px] max-w-md`;

    toastElement.style.cssText = `
      animation: slideInRight 0.3s ease-out;
      opacity: 1;
      transform: translateX(0);
    `;

    const iconMap = {
      error: `
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `,
      info: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `,
      success: `
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `,
      warning: `
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      `,
    };

    toastElement.innerHTML = `
      <div class="flex items-center gap-3 flex-1">
        ${iconMap[type]}
        <span class="flex-1">${message}</span>
      </div>
      <button class="btn btn-ghost btn-sm btn-circle" onclick="this.parentElement.remove()">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    `;

    toastContainer.appendChild(toastElement);

    const timeoutId = setTimeout(() => {
      toastElement.style.cssText = `
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease-out;
      `;
      setTimeout(() => toastElement.remove(), 300);
    }, duration);

    toastElement.addEventListener('mouseenter', () => {
      clearTimeout(timeoutId);
    });

    toastElement.addEventListener('mouseleave', () => {
      setTimeout(() => {
        toastElement.style.cssText = `
          opacity: 0;
          transform: translateX(100%);
          transition: all 0.3s ease-out;
        `;
        setTimeout(() => toastElement.remove(), 300);
      }, 1000);
    });
  },

  error: (message: string, duration?: number) =>
    toast.show(message, 'error', duration),
  info: (message: string, duration?: number) =>
    toast.show(message, 'info', duration),
  success: (message: string, duration?: number) =>
    toast.show(message, 'success', duration),
  warning: (message: string, duration?: number) =>
    toast.show(message, 'warning', duration),
};
