export const siteContent = {
  name: 'netminn012',
  domain: 'netminn012.com',
  tagline: 'ツイ廃学生 自称ガジェット界隈',
  metaDescription: 'netminn012のホームページ・リンク集',
  profileImage: '/profile.jpg',
  ogImage: '/og-image.png',
  sections: {
    main: { title: 'メインリンク', description: 'よく使っているサービス' },
    other: { title: 'その他のリンク', description: 'アカウントと投稿サービス' },
    sites: { title: '運営しているサイト', description: '個人で管理しているWebサイト' },
  },
  footerLinks: [
    { label: 'GitHub', url: 'https://github.com/netminn012' },
    { label: 'Source', url: 'https://github.com/netminn012/netminn012.github.io' },
  ],
} as const;
