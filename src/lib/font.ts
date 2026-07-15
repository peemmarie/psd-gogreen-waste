import localFont from 'next/font/local'

export const ibmSans = localFont({
  src: [
    {
      path: '../assets/fonts/GoogleSans-Regular.ttf',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../assets/fonts/GoogleSans-Medium.ttf',
      style: 'normal',
      weight: '500',
    },
    {
      path: '../assets/fonts/GoogleSans-SemiBold.ttf',
      style: 'normal',
      weight: '600',
    },
    {
      path: '../assets/fonts/GoogleSans-Bold.ttf',
      style: 'normal',
      weight: '700',
    },
  ],
  variable: '--font-ibm-sans',
})
