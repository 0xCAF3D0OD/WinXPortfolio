import { defineComponent, h } from 'vue'

// Crée un composant qui affiche un PDF dans la fenêtre, avec une barre
// « Ouvrir dans un nouvel onglet / Télécharger ».
export function pdfViewer(url: string) {
  return defineComponent({
    name: 'PdfViewer',
    setup() {
      return () =>
        h('div', { style: 'display:flex;flex-direction:column;height:100%;background:#525659' }, [
          h(
            'div',
            {
              style:
                'display:flex;gap:14px;align-items:center;padding:5px 10px;background:#ece9d8;border-bottom:1px solid #aca899;flex-shrink:0;font-family:Tahoma,sans-serif',
            },
            [
              h(
                'a',
                {
                  href: url,
                  target: '_blank',
                  rel: 'noopener',
                  style: 'font-size:12px;color:#0b57d0;text-decoration:none',
                },
                'Ouvrir dans un nouvel onglet ↗',
              ),
              h(
                'a',
                {
                  href: url,
                  download: '',
                  style: 'font-size:12px;color:#0b57d0;text-decoration:none',
                },
                'Télécharger',
              ),
            ],
          ),
          h('iframe', {
            src: url,
            title: 'PDF',
            style: 'flex:1;min-height:0;border:0;width:100%;background:#525659',
          }),
        ])
    },
  })
}
