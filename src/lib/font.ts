import localFont from 'next/font/local'

export const ibmSans = localFont({
  src: [
    {
      path: '../assets/fonts/IBMPlexSansThai-Regular.ttf',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../assets/fonts/IBMPlexSansThai-Medium.ttf',
      style: 'normal',
      weight: '500',
    },
    {
      path: '../assets/fonts/IBMPlexSansThai-SemiBold.ttf',
      style: 'normal',
      weight: '600',
    },
    {
      path: '../assets/fonts/IBMPlexSansThai-Bold.ttf',
      style: 'normal',
      weight: '700',
    },
  ],
  variable: '--font-ibm-sans',
})
