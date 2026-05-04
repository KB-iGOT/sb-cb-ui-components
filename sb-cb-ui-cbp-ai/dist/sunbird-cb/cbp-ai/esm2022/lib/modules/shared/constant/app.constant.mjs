export const HEADER_DATA = {
    welcome: {
        welcomeText: `WELCOME TO KARMAYOGI BHARAT`,
        imageUrl: `./assets/img/flag.svg`,
    },
    karmayogiBtn: {
        text: `Karmayogi's Corner`,
        link: `/latest-updates`,
        display: true
    },
    donloadBtn: {
        text: `Download app`,
        link: `#igotMobileapp`,
        display: true
    },
    btns: [
        {
            text: `हिंदी`,
            link: `hindi`,
            type: `upperCase`,
            language: `Hindi`
        }
    ],
    navHeader: {
        karmayogiBharath: {
            imgSrc: `/assets/img/karmayogiLogo.svg`,
            link: ``
        },
        navButtons: [
            {
                text: ``,
                link: ``,
                fragment: '',
            },
            {
                text: `topNavBar.aboutUs`,
                link: `aboutUs`,
                fragment: 'about_us',
            },
            {
                text: `topNavBar.newsroom`,
                link: `.`,
                fragment: 'newsroom',
            },
            {
                text: `topNavBar.career`,
                link: `career`,
                fragment: 'career',
            },
            {
                text: `topNavBar.tenders`,
                link: `tenders`,
                fragment: 'tenders',
            },
            {
                text: `topNavBar.notifications`,
                link: `notifications`,
                fragment: 'notifications',
            },
            {
                text: `topNavBar.contactUs`,
                link: `contactus`,
                fragment: 'contactus',
            }
        ],
        loginBtn: {
            text: `topNavBar.login`,
            link: `protected/v8/resource`
        },
        registerBtn: {
            text: `topNavBar.register`,
            link: `public/signup`,
        },
        contactLink: {
            text: `topNavBar.contactUs`,
            link: `contactus`,
            fragment: 'contactus',
        }
    },
};
export const DASHBOARD_ANALYTICS_LIST = [
    {
        dashboaredHeader: `Number of users/MDO's`,
        analyticsList: [
            {
                imgSrc: `./assets/img/learnsGraph.svg`,
                count: `0`,
                description: `Karmayogis onboarded`,
                alt: `learns record`,
                id: `karmayogiOnboarded`
            }, {
                imgSrc: `./assets/img/learnsGraph.svg`,
                count: `0`,
                description: `Registered MDO's`,
                alt: `learns record`,
                id: `registeredMdo`
            },
        ]
    },
    {
        dashboaredHeader: `Available content`,
        analyticsList: [
            {
                imgSrc: `./assets/img/coursesGraph.svg`,
                count: `0`,
                description: `Courses`,
                alt: `Courses record`,
                id: `courses`
            }, {
                imgSrc: `./assets/img/contentGraph.svg`,
                count: `0`,
                description: `Available content (hours)`,
                alt: `Content record`,
                id: `availableContent`
            },
        ]
    }
];
export const FEATURES_COURSES = {
    header: {
        headerText: `courses.showcasedCourses`,
        type: `featured-courses`,
        showAll: `courses.showAll`
    },
    dataList: [],
};
export const TESTIMONIALS = {
    header: {
        headerText: `testimonial`,
        type: `testimonials`
    },
    dataList: [
        {
            posterImage: `assets/testimonials/testimonial-1.webp`,
            name: `Preet Bharat`,
            description: `iGOT is just like a seed that has been planted with the potential to grow into a mighty tree for progress and development of nation. With the support and motivation from MDOs, this initiative has the potential to bear the tastiest fruits for the betterment of society. MDOs can nurture the potential within individuals and empower them to contribute positively to society."`,
            desig: `CRPF`,
        },
        {
            posterImage: `assets/testimonials/testimonial-2.webp`,
            name: `Preet Bharat`,
            description: `iGOT is just like a seed that has been planted with the potential to grow into a mighty tree for progress and development of nation. With the support and motivation from MDOs, this initiative has the potential to bear the tastiest fruits for the betterment of society. MDOs can nurture the potential within individuals and empower them to contribute positively to society."`,
            desig: `CRPF`,
        },
        {
            posterImage: `assets/testimonials/testimonial-3.webp`,
            name: `Preet Bharat`,
            description: `iGOT is just like a seed that has been planted with the potential to grow into a mighty tree for progress and development of nation. With the support and motivation from MDOs, this initiative has the potential to bear the tastiest fruits for the betterment of society. MDOs can nurture the potential within individuals and empower them to contribute positively to society."`,
            desig: `CRPF`,
        },
        {
            posterImage: `assets/testimonials/testimonial-4.webp`,
            name: `Preet Bharat`,
            description: `iGOT is just like a seed that has been planted with the potential to grow into a mighty tree for progress and development of nation. With the support and motivation from MDOs, this initiative has the potential to bear the tastiest fruits for the betterment of society. MDOs can nurture the potential within individuals and empower them to contribute positively to society."`,
            desig: `CRPF`,
        },
        {
            posterImage: `assets/testimonials/testimonial-5.webp`,
            name: `Preet Bharat`,
            description: `iGOT is just like a seed that has been planted with the potential to grow into a mighty tree for progress and development of nation. With the support and motivation from MDOs, this initiative has the potential to bear the tastiest fruits for the betterment of society. MDOs can nurture the potential within individuals and empower them to contribute positively to society."`,
            desig: `CRPF`,
        },
    ],
};
export const NEWSROOM_COURSES = {
    header: {
        headerText: `newsRoom`,
        type: `news-room`
    },
    dataList: [],
    localDataList: [
        {
            posterImage: `./assets/newsroom/newsletter-1.jpg`,
            name: `Volume 1 Issue 9( October - November 2023)`,
            downloadLink: './assets/newsroom/news-letter-pdf/January Newsletter_Final 2.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-2.jpg`,
            name: `Volume 1 Issue 9( October - November 2023)`,
            downloadLink: './assets/newsroom/news-letter-pdf/Newsletter Year Edition.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-3.png`,
            name: `Volume 1 Issue 9( October - November 2023)`,
            downloadLink: './assets/newsroom/news-letter-pdf/Newsletter December.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-4.png`,
            name: `Volume 1 Issue 9( October - November 2023)`,
            downloadLink: './assets/newsroom/news-letter-pdf/nov.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-5.jpeg`,
            name: `Volume 1 Issue 9( October - November 2023)`,
            downloadLink: './assets/newsroom/news-letter-pdf/October_Newsletter.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-6.png`,
            name: `Volume 1 Issue 9( October - November 2023)`,
            downloadLink: './assets/newsroom/news-letter-pdf/sep.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-7.jpg`,
            name: `Volume 1 Issue 9( October - November 2023)`,
            downloadLink: './assets/newsroom/news-letter-pdf/Newsletter August.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-8.jpg`,
            name: `Volume 1 Issue 9( October - November 2023)`,
            downloadLink: './assets/newsroom/news-letter-pdf/Newsletter June-July.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `Volume 1 Issue 9( October - November 2023)`,
            downloadLink: './assets/newsroom/news-letter-pdf/Newsletter May.pdf',
            button: `Download PDF`,
        },
        // {
        //     posterImage: `./assets/newsroom/newsletter-10.jpg`,
        //     name: `Volume 1 Issue 9( October - November 2023)`,
        //     downloadLink: './assets/newsroom/news-letter-pdf/Newsletter_April_6.pdf',
        //     button: `Download PDF`,
        // },
        // {
        //     posterImage: `./assets/newsroom/newsletter-11.jpg`,
        //     name: `Volume 1 Issue 9( October - November 2023)`,
        //     downloadLink: './assets/newsroom/news-letter-pdf/March l Vol1 I Issue 2.pdf',
        //     button: `Download PDF`,
        // },
        // {
        //     posterImage: `./assets/newsroom/newsletter-12.jpg`,
        //     name: `Volume 1 Issue 9( October - November 2023)`,
        //     downloadLink: './assets/newsroom/news-letter-pdf/final newsletter.pdf',
        //     button: `Download PDF`,
        // },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `Aspirational Blocks Programme Module Now Live On iGOT Karmayogi Platform`,
            downloadLink: './assets/newsroom/news-letter-pdf/PIB1956555 (2).pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `Workshop on Art of Leadership Communication organized by Karmayogi Bharat`,
            downloadLink: './assets/newsroom/news-letter-pdf/PIB1965959 (1).pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `Courses launched by Sashastra Seema Bal now Live on iGOT Karmayogi platform`,
            downloadLink: './assets/newsroom/news-letter-pdf/PIB1966086.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `Celebrating 1st Year Anniversary of Karmayogi Prarambh`,
            downloadLink: './assets/newsroom/news-letter-pdf/Celebrating 1st Year Anniversary of Karmayogi Prarambh.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `Accessibility Widget launched on the iGOT Karmayogi Platform on International Day of Persons with Disabilities`,
            downloadLink: './assets/newsroom/news-letter-pdf/Press Information Bureau.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `SAMARTH Curated Programs launched by Karmayogi Bharat and NITI Aayog`,
            downloadLink: './assets/newsroom/news-letter-pdf/PIB1990840.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `Dr. Jitendra Singh, Minister of State for Personnel, Public Grievances and Pensions  to inaugurate Good Governance Day on 25th December, 2023`,
            downloadLink: './assets/newsroom/news-letter-pdf/Press Information Bureau1.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `Union Minister Dr Jitendra Singh says, "Mission Karmayogi", launched by Prime Minister Shri Narendra Modi, had institutionalised the process of capacity building, particularly for the benefit of civil servants`,
            downloadLink: './assets/newsroom/news-letter-pdf/PIB1921429 (1).pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `PM distributes about 71,000 appointment letters to newly inducted recruits under Rozgar Mela`,
            downloadLink: './assets/newsroom/news-letter-pdf/Press Information Bureau2.pdf',
            button: `Download PDF`,
        },
        {
            posterImage: `./assets/newsroom/newsletter-9.png`,
            name: `PM distributes more than 1 lakh appointment letters to newly inducted recruits in Government departments and organisations under Rozgar Mela`,
            downloadLink: './assets/newsroom/news-letter-pdf/Press Information Bureau3.pdf',
            button: `Download PDF`,
        },
    ]
};
export const TOP_PROVIDERS = {
    header: {
        headerText: `partners`,
        type: `content-providers`
    },
    topProvidersList: [
        {
            posterImage: `assets/top_providers/Apolitical.png`,
            name: `Apolitical`,
            clientUrl: `https://apolitical.co/home/`
        },
        {
            posterImage: `assets/top_providers/LBSNAA.png`,
            name: `LBSNAA`,
            clientUrl: `https://portal.igotkarmayogi.gov.in/app/learn/browse-by/provider/LBSNAA/all-CBP`
        },
        {
            posterImage: `assets/top_providers/ISTM.png`,
            name: `ISTM`,
            clientUrl: `https://portal.igotkarmayogi.gov.in/app/learn/browse-by/provider/Institute of Secretariat Training and Management/all-CBP`
        },
        {
            posterImage: `assets/top_providers/Udemy.png`,
            name: `Udemy`,
            clientUrl: `https://www.udemy.com/`
        },
        {
            posterImage: `assets/top_providers/ISRO.png`,
            name: `ISRO`,
            clientUrl: `https://www.isro.gov.in/`
        },
        {
            posterImage: `assets/top_providers/Microsoft.png`,
            name: `Microsoft`,
            clientUrl: `https://portal.igotkarmayogi.gov.in/app/learn/browse-by/provider/Microsoft/all-CBP`
        },
        {
            posterImage: `assets/top_providers/Karmayogi Bharat.png`,
            name: `Karmayogi Bharat`,
            clientUrl: `https://karmayogibharat.gov.in/`
        },
        {
            posterImage: `assets/top_providers/SVPNPA.png`,
            name: `SVPNPA`,
            clientUrl: `https://portal.igotkarmayogi.gov.in/app/learn/browse-by/provider/SVPNPA/all-CBP`
        },
    ]
};
export const ABOUT_US = {
    header: {
        headerText: `topNavBar.aboutUs`,
        p1: `Karmayogi Bharat, a Special Purpose Vehicle (SPV), is a crucial part of this framework. It was incorporated on 31.01.2022 under Section 8 of the Companies Act, 2013 as a 100% Government owned not-for-profit Co`,
        p2: `Its responsibility is to operate and manage the iGOT Karmayogi platform, ensurintimewhere-dqevice learning for civil service officials to enhance their competency. The SPV will own, manage, maintain, and improve the digital assets, including the IPR of all software, content, process etc. on behalf of the Government with an annual subscription-based revenue model.`,
        p3: `Its responsibility is to operate and manage the iGOT Karmayogi platform, ensurintimewhere-dqevice learning for civil service officials to enhance their competency. The SPV will own, manage, maintain, and improve the digital assets, including the IPR of all software, content, process etc. on behalf of the Government with an annual subscription-based revenue model.`,
        type: "about-us"
    },
    dataList: [{
            image: `assets/aboutus/about-new.JPG`,
        }
    ]
};
export const VIDEO_CONF = {
    title: `conference.title`,
    thumbnail: `assets/videoconference/thumbnail.png`,
    text: `conference.support`,
    date: `conference.duration`,
    time: `conference.slot`,
    button: `conference.action`,
    joinLink: "https://teams.microsoft.com/l/meetup-join/19%3ameeting_M2Y3ZDE2ZDMtMWQwYS00OWQzLWE3NDctNDRkNTdjOGI4Yzll%40thread.v2/0?context=%7b%22Tid%22%3a%2240cfb65c-9b71-435f-8bc2-bc2c69df1aca%22%2c%22Oid%22%3a%22cbd37bc9-5c33-401f-b590-9decb3c370f8%22%7d",
    technicalSupport: `conference.technicalSupport`,
    plsContact: `conference.plsContact`
};
export const PHOTO_GALLARY = {
    header: {
        headerText: `gallery.photoGallery`,
        type: `photo-gallary`
    },
    galleryList: [
        { name: "Rectangle1", src: "assets/photos_gallery/Rectangle1.png" },
        { name: "Rectangle2", src: "assets/photos_gallery/Rectangle2.png" },
        { name: "Rectangle3", src: "assets/photos_gallery/Rectangle3.png" },
        { name: "Rectangle4", src: "assets/photos_gallery/Rectangle4.png" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/9059c922-40a5-4a51-91ae-af9abecbcb7b.jpeg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/332470235_470417818506417_6989887497328782909_n.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/332489727_742771693929365_7451095071369935484_n (1).jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/344061562_1463582880844463_2813493197040593989_n.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/353772828_197260853276676_2428144849076294106_n.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/387826043_271464862522941_8285872309702331271_n.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/400624395_290754297260664_7366696641428760011_n.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/df1ffe85-76ee-4fb3-831b-3e6c2f62785d.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/IMG_2303.JPG" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-41.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-44.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-45_1.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-45.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-46.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-47_1.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-47.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-48.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-49.jpg" },
        { name: "Rectangle4", cloudStorageKey: "assets/photos_gallery/PHOTO-2024-02-19-17-28-50.jpg" },
    ]
};
export const IGON_VISION_DETAILS = {
    vision: {
        imgUrl: `./assets/img/visionImg.svg`,
        alt: `How does the platform enable you to become the best version of yourself?`,
    },
    videos: [
        {
            poster: `./assets/img/video1.png`,
            videoLink: `./assets/img/Sanjeev-final.mp4`,
            line1: `An `,
            line2: `experienced`,
            line3: ` civil servant`,
        },
        {
            poster: `./assets/img/video2.png`,
            videoLink: `./assets/img/Shilpa-final.mp4`,
            line1: `A `,
            line2: `newly`,
            line3: ` recruited civil servant`,
        },
    ],
};
export const CONFERENCE_DATA = {
    title: 'conference.title',
    description: 'conference.support',
    workdays: 'conference.duration',
    timings: 'conference.slot',
    joinNow: 'conference.action'
};
export const REGISTER_DETAILS = {
    lineOne: `Take the`,
    lineTwo: `first step`,
    lineThree: ` towards learning`,
    registerBtn: {
        text: `Register Now`,
        link: `public/signup`
    }
};
export const SOLUTIONS_SPACE = {
    solutionSpaceHeader: {
        lineOne: `Solutioning space`,
        lineTwo: `for all of Government`,
    },
    solutionSpacesList: [
        {
            name: `Learning hub`,
            description: `Learwheretime and bridge your competency gaps using impactful and engaging learning content.`,
            imgSrc: `./assets/img/school.svg`,
        }, {
            name: `Discussion hub`,
            description: `Discuss and learn with peers, colleagues, civil servants and experts across the country.`,
            imgSrc: `./assets/img/forum.svg`,
        }, {
            name: `Network hub`,
            description: `Connect with civil servants across the country. Grow your network within government circles.`,
            imgSrc: `./assets/img/group.svg`,
        }, {
            name: `Competency hub`,
            description: `Identify your competency requirements, competency gaps, so you can grow faster in the right direction.`,
            imgSrc: `./assets/img/extension.svg`,
        }, {
            name: `Career hub`,
            description: `Explore career opportunities across the country and signal your expertise.`,
            imgSrc: `./assets/img/work.svg`,
        }, {
            name: `Event hub`,
            description: `Enable simultaneous interactive experiential and peer learning.`,
            imgSrc: `./assets/img/event.svg`,
        },
    ]
};
export const QUICK_WALKTHROUGH_DETAILS = {
    videoLink: `./assets/img/KarmayogiBharatWalkthroughNew.mp4`,
    lineOne: `A quick`,
    lineTwo: ` walkthrough of`,
    lineThree: ` the `,
    lineFour: ` Karmayogi Bharat`,
    lineFive: `Portal`,
};
export const MOBILE_APP_DOWNLOADS_DETAILS = {
    download: `downloadSection.download`,
    iGOT: `downloadSection.iGot`,
    karmayogi: `downloadSection.karmayogi`,
    mobile: "downloadSection.mobile",
    app: "downloadSection.app",
    description: `downloadSection.description`,
    scanners: [
        {
            link: `https://play.google.com/store/apps/details?id=com.igot.karmayogibharat&pli=1`,
            imgSrc: `./assets/img/Google_Play-Badge-Logo.wine.png`,
            scannerSrc: `./assets/img/scan/qrcode.svg`,
            text: `downloadSection.scanToDownload`,
        },
        {
            link: `https://apps.apple.com/in/app/igot-karmayogi/id6443949491`,
            imgSrc: `./assets/img/download-appstore.png`,
            scannerSrc: `./assets/img/scan/iOS_qrcode.svg`,
            text: `downloadSection.scanToDownload`,
        },
    ],
    mockupImgSrc: `./assets/img/mobile-latest.png`
};
export const MOBILE_VIEW_APP_DOWNLOADS_DETAILS = {
    googleStore: {
        imgSrc: `./assets/img/Google_Play-Badge-Logo.wine.png`,
        link: `https://play.google.com/store/apps/details?id=com.igot.karmayogibharat&pli=1`,
    },
    appleStore: {
        imgSrc: `./assets/img/download-appstore.png`,
        link: `https://apps.apple.com/in/app/igot-karmayogi/id6443949491`,
    },
    lineOne: `Download iGOT Karmayogi `,
    lineTwo: `mobile app`
};
export const NAV_FOOTER_DETAILS = {
    navLinks: [
        [
            {
                href: `newsroom`,
                target: `_self`,
                router: '/',
                name: `footerLinks.newsroom`,
            },
            {
                href: `https://portal.igotkarmayogi.gov.in/public/faq`,
                target: `_self`,
                name: `footerLinks.faq`,
                application: 'diff',
            },
            {
                href: `contact_us`,
                target: `_self`,
                router: '/',
                name: `footerLinks.contactUs`
            }
        ],
        [
            {
                href: `mdoUserList`,
                target: `_self`,
                router: `mdoList`,
                name: `footerLinks.nodalOffice`
            },
            {
                href: `latest-updates`,
                target: `_self`,
                router: 'latest-updates',
                name: `footerLinks.karmayogiCorner`
            },
            {
                href: `https://portal.igotkarmayogi.gov.in/public/signup`,
                target: `_self`,
                name: `topNavBar.register`,
                application: 'diff',
            },
        ],
        [
            {
                href: `https://karmayogibharat.gov.in/`,
                target: `_blank`,
                name: `footerLinks.missionKarmayogi`
            },
            {
                href: `https://dopt.gov.in/`,
                target: `_blank`,
                name: `footerLinks.dopt`
            },
            {
                href: `https://cbc.gov.in/`,
                target: `_blank`,
                name: `footerLinks.cpc`
            },
            {
                href: `https://portal.igotkarmayogi.gov.in/public/privacy-policy/`,
                target: `_blank`,
                name: `footerLinks.privacyPolicy`
            },
        ]
    ],
    followUs: 'socailHub.followUs',
    // copyRights: 'Copyright © Website managed by Karmayogi Bharat.',
    // copyRightMobile: 'Copyright © Website managed by Karmayogi Bharat.'
    copyRights: 'Copyright',
    copyRightMobile: 'CopyrightMobile'
};
export const NAV_FOOTER_DETAILS_MOBILE = {
    support: [
        {
            href: `https://portal.igotkarmayogi.gov.in/public/faq`,
            target: `_self`,
            name: `footerLinks.faq`,
            application: 'diff',
        },
        {
            href: `contact_us`,
            target: `_self`,
            router: '/',
            name: `footerLinks.contactUs`
        },
        {
            href: `mdoUserList`,
            target: `_self`,
            router: `mdoList`,
            name: `footerLinks.nodalOffice`
        },
    ],
    releated: [
        {
            href: `newsroom`,
            target: `_self`,
            router: '/',
            name: `footerLinks.newsroom`,
        },
        {
            href: `latest-updates`,
            target: `_self`,
            router: 'latest-updates',
            name: `footerLinks.karmayogiCorner`
        },
        {
            href: `https://portal.igotkarmayogi.gov.in/public/signup`,
            target: `_self`,
            name: `topNavBar.register`,
            application: 'diff',
        },
        {
            href: `https://karmayogibharat.gov.in/`,
            target: `_blank`,
            name: `footerLinks.missionKarmayogi`
        },
        {
            href: `https://dopt.gov.in/`,
            target: `_blank`,
            name: `footerLinks.dopt`
        },
        {
            href: `https://cbc.gov.in/`,
            target: `_blank`,
            name: `footerLinks.cpc`
        },
        {
            href: `https://portal.igotkarmayogi.gov.in/public/privacy-policy/`,
            target: `_blank`,
            name: `footerLinks.privacyPolicy`
        },
    ],
    followUs: 'socailHub.followUs',
    copyRights: 'Copyright © Website managed by Karmayogi Bharat.',
    copyRightMobile: 'Copyright © Website managed by Karmayogi Bharat.'
};
export const FOOTER_DETAILS = {
    copyRights: 'Copyright © Website managed by Karmayogi Bharat.'
};
export const HOW_TO_CARD_LIST = {
    header: {
        headerText: `How to`,
        type: `howto`
    },
    dataList: [
        {
            title: 'How to Register?', link: '', icon: "assets/img/howto/Rectangle3.png"
        },
        {
            title: 'How to Login?', link: '', icon: "assets/img/howto/Rectangle1.png"
        },
        {
            title: 'Platform Walkthrough', link: '', icon: "assets/img/howto/Rectangle2.png"
        }
    ],
};
export const INFOCUS_CARD = [{
        videoCategory: 'course_intro',
        header: {
            headerText: `Video Gallery`,
            type: `video-gallery`
        },
        dataList: [
            {}
        ]
    }];
export const WHAT_IS_CARD = {
    header: {
        headerText: `what-is`,
        type: `what-is`
    },
    dataList: [
        // {
        //     id: 'whatIsIGot',
        //     imgSrc: `assets/whatis/igot1stvideo.jpg`,
        //     name: 'walkThrough.whatIsIGot',
        //     link: 'https://www.youtube.com/watch?v=CgSHMbEhf6E'
        // },
        {
            id: 'howToLoginAndRegister',
            imgSrc: `assets/whatis/howtoregister.jpg`,
            name: 'walkThrough.howToLoginAndRegister',
            link: 'https://www.youtube.com/watch?v=MH12AkVBs3k'
        }, {
            id: 'igotWalkthrough',
            imgSrc: `assets/whatis/Rectangle3.png`,
            name: 'walkThrough.igotWalkthrough',
            link: 'https://www.youtube.com/watch?v=mak7BPe_0jY'
        }
    ],
};
export const FOOTER_PROVIDER = [
    { href: 'https://cbc.gov.in/', src: "assets/footer-provider/new/capacity-building.svg" },
    { href: 'https://www.digitalindia.gov.in/', src: "assets/footer-provider/new/digital-india.svg" },
    { href: 'https://dopt.gov.in/', src: "assets/footer-provider/new/dopt.svg" },
    { href: 'https://data.gov.in/', src: "assets/footer-provider/new/data-gov.svg" },
    { href: 'https://www.meity.gov.in/', src: "assets/footer-provider/new/MEIT.svg" },
    { href: 'https://www.mygov.in/', src: "assets/footer-provider/new/my-gov.svg" },
    { href: 'https://www.pmindia.gov.in/en/', src: "assets/footer-provider/new/pm-india.svg" },
    { href: 'https://www.india.gov.in/', src: "assets/footer-provider/new/india-gov.svg" },
];
export const STAT_ARR = [
    { icon: "assets/stat_icon/Network 2.svg", count: "30+ Lakhs", name: "stats.karmayogisOnboarded" },
    { icon: "assets/stat_icon/Program.svg", count: "868", name: "stats.totalCourses" },
    { icon: "assets/stat_icon/Network 4.svg", count: "3,846", name: "stats.totalCompletitions" },
    { icon: "assets/stat_icon/people.svg", count: "1,595", name: "stats.monthlyActiveUsers" },
    { icon: "assets/stat_icon/Network 5.svg", count: "1,595", name: "stats.certificatesIssued" },
];
export const SOCIAL_LINKS = [
    { active: true, href_url: "https://twitter.com/iGOTKarmayogi", name: "twitter", src: "assets/social_icons/x.svg" },
    { active: true, href_url: "https://www.linkedin.com/company/karmayogi-bharat/", name: "linkedin", src: "assets/social_icons/in.svg" },
    { active: true, href_url: "https://www.youtube.com/channel/UCPO2faT8YEi6Q_2IY5kf2Dg", name: "youtube", src: "assets/social_icons/yt.svg" },
    { active: true, href_url: "https://www.instagram.com/karmayogibharat/", name: "instagram", src: "assets/social_icons/inst.svg" },
    { active: true, href_url: "https://www.facebook.com/profile.php?id=100089782863897", name: "facebook", src: "assets/social_icons/fb.svg" },
];
export const LANGUAGES = [
    {
        "value": "বাংলা",
        "key": "be"
    },
    {
        "value": "English",
        "key": "en"
    },
    {
        "value": "हिंदी",
        "key": "hi"
    },
    {
        "value": "ಕನ್ನಡ",
        "key": "ka"
    },
    // {
    //     "value": "മലയാളം",
    //     "key": "ml"
    // },
    {
        "value": "मराठी",
        "key": "mr"
    },
    {
        "value": "தமிழ்",
        "key": "ta"
    },
    // {
    //     "value": "తెలుగు",
    //     "key": "te"
    // },
    // {
    //     "value": "অসমীয়া",
    //     "key": "as"
    // },
    // {
    //     "value": "ગુજરાતી",
    //     "key": "gu"
    // },
    // {
    //     "value": "ଓଡିଆ",
    //     "key": "od"
    // },
    // {
    //     "value": "ਪੰਜਾਬੀ",
    //     "key": "pu"
    // }
];
export const ORGANISATION_PARTNERS = {
    header: {
        headerText: `organisationPartners.title`,
        type: `organisationsPartners`
    },
    dataList: [
        {
            id: '1',
            text: 'organisationPartners.slideText_1'
        },
        {
            id: '2',
            text: 'organisationPartners.slideText_2'
        },
        {
            id: '3',
            text: 'organisationPartners.slideText_3'
        },
        {
            id: '4',
            text: 'organisationPartners.slideText_4'
        },
        {
            id: '5',
            text: 'organisationPartners.slideText_5'
        },
    ],
};
export const FAQ_CHATBOT = {
    FaqTitle: `FaqTitle`
};
export const KARMAYOGI_CORNER = {
    title: `karmayogiCorner`
};
export const ABOUT_KARMAYOGI = {
    header: {
        headerText: 'aboutUsPage.title'
    },
    about: {
        image: {
            imageLink: 'assets/aboutus/about-us-banner.png',
            imageHeader: 'aboutUsPage.teamKarmayogiBharat'
        },
        aboutUs: [
            'aboutUsPage.contest1',
            `aboutUsPage.contest2`
        ],
        karmayogiVisions: [
            {
                iconLink: 'assets/aboutus/vision_icon.svg',
                iconClass: 'vision-icon',
                header: 'aboutUsPage.vision',
                description: 'aboutUsPage.visionDescription'
            },
            {
                iconLink: 'assets/aboutus/mission_icon.svg',
                iconClass: 'mission-icon',
                header: 'aboutUsPage.mission',
                description: 'aboutUsPage.missionDescription'
            }
        ],
    },
};
export const KARMAYOGI_FUNCTIONS = {
    header: 'karmayogiFunctions.title',
    functions: [
        {
            iconLink: 'assets/aboutus/functions_icons/design_function.svg',
            description: 'karmayogiFunctions.designFunction'
        },
        {
            iconLink: 'assets/aboutus/functions_icons/govassests.svg',
            description: 'karmayogiFunctions.governmentAssests'
        },
        {
            iconLink: 'assets/aboutus/functions_icons/file.svg',
            description: 'karmayogiFunctions.create'
        },
        {
            iconLink: 'assets/aboutus/functions_icons/manage_assessment.svg',
            description: 'karmayogiFunctions.manageAssessment'
        },
        {
            iconLink: 'assets/aboutus/functions_icons/telemetry_data.svg',
            description: 'karmayogiFunctions.telemetryData'
        },
        {
            iconLink: 'assets/aboutus/functions_icons/hq.svg',
            description: 'karmayogiFunctions.guidelines'
        },
        {
            iconLink: 'assets/aboutus/functions_icons/mechanism.svg',
            description: 'karmayogiFunctions.mechanism'
        },
        {
            iconLink: 'assets/aboutus/functions_icons/procurement.svg',
            description: 'karmayogiFunctions.procurement'
        },
        {
            iconLink: 'assets/aboutus/functions_icons/information.svg',
            description: 'karmayogiFunctions.information'
        },
    ]
};
export const KARMAYOGI_TEAM = {
    header: 'karmayogiTeam.title',
    categories: [
        {
            tabName: 'karmayogiTeam.boardOfDirectorTab',
            tabId: 'director',
            teamMembers: [
                {
                    memberName: 'karmayogiTeam.teamMembers.subramanianRamadorai',
                    imageLink: 'assets/aboutus/directorList/subhramanian.png',
                    roles: 'karmayogiTeam.teamMemberRoles.subramanianRamadoraiRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://x.com/s_ramadorai?s=21'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/subramanian-ramadorai-8847a5265?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.rachnaShah',
                    imageLink: 'assets/aboutus/directorList/rachnaShah.png',
                    roles: 'karmayogiTeam.teamMemberRoles.rachnaShahRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.skrishnan',
                    imageLink: 'assets/aboutus/directorList/s krishnan.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.skrishnanRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://x.com/abhish18?s=21'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/abhisheksinghias?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.govindIyer',
                    imageLink: 'assets/aboutus/directorList/govind.png',
                    roles: 'karmayogiTeam.teamMemberRoles.govindIyerRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/govindiyer?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.nirmaljeetSinghKalsi',
                    imageLink: 'assets/aboutus/directorList/nirmaljeet.png',
                    roles: 'karmayogiTeam.teamMemberRoles.nirmaljeetSinghKalsiRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://x.com/nskalsi?s=21'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/dr-nirmaljeet-singh-kalsi-ias-retd-0b84561?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.pankajBansal',
                    imageLink: 'assets/aboutus/directorList/pankaj.png',
                    roles: 'karmayogiTeam.teamMemberRoles.pankajBansalRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://x.com/pankajbansalpb?s=21'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/pbpankajbansal?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.debjaniGhosh',
                    imageLink: 'assets/aboutus/directorList/debjani.png',
                    roles: 'karmayogiTeam.teamMemberRoles.debjaniGhoshRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://x.com/debjani_ghosh_?s=21'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/debjani-ghosh-48298b1?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.lalithaLakshmi',
                    imageLink: 'assets/aboutus/directorList/CEO-Mam.png',
                    roles: 'karmayogiTeam.teamMemberRoles.lalithaLakshmiRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.ashishPai',
                    imageLink: 'assets/aboutus/directorList/ashish.png',
                    roles: 'karmayogiTeam.teamMemberRoles.ashishPaiRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/ashish-pai-10499a12/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                // {
                //     memberName: 'karmayogiTeam.teamMembers.hemangJani',
                //     imageLink: 'assets/aboutus/jani.svg',
                //     roles: 'karmayogiTeam.teamMemberRoles.hemangJaniRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: ''
                //         }
                //     ]
                // },
                // {
                //     memberName: 'karmayogiTeam.teamMembers.alkeshKumarSharma',
                //     imageLink: 'assets/aboutus/alkesh.svg',
                //     roles: 'karmayogiTeam.teamMemberRoles.alkeshKumarSharmaRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: ''
                //         }
                //     ]
                // },
                // {
                //     memberName: 'karmayogiTeam.teamMembers.santruptMisra',
                //     imageLink: 'assets/aboutus/santrupt.svg',
                //     roles: 'karmayogiTeam.teamMemberRoles.santruptMisraRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: ''
                //         }
                //     ]
                // },
            ]
        },
        {
            tabName: 'karmayogiTeam.karmayogiTeamTab',
            tabId: 'Karmayogi',
            teamMembers: [
                {
                    memberName: 'karmayogiTeam.teamMembers.lalithaLakshmi',
                    imageLink: 'assets/aboutus/directorList/CEO-Mam.png',
                    roles: 'karmayogiTeam.teamMemberRoles.lalithaLakshmiRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://x.com/abhish18?s=21'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/abhisheksinghias?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.rakeshVerma',
                    imageLink: 'assets/aboutus/karmayogiTeam/rakesh.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.rakeshVermaRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.ashishPaiWithoutSri',
                    imageLink: 'assets/aboutus/directorList/ashish.png',
                    roles: 'karmayogiTeam.teamMemberRoles.ashishPaiRolesWithoutKarmayogi',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/ashish-pai-10499a12/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.ranaPratapSingh',
                    imageLink: 'assets/aboutus/karmayogiTeam/ranaPratapSingh.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.ranaPratapSinghRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://twitter.com/ranaprsingh'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/ranapratapsingh1/'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.monojeetChakravorty',
                    imageLink: 'assets/aboutus/karmayogiTeam/monojeet.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.monojeetChakravortyRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                // {
                //     memberName: 'karmayogiTeam.teamMembers.harleenSachdeva',
                //     imageLink: 'assets/aboutus/karmayogiTeam/harleenSachdeva.jpg',
                //     roles: 'karmayogiTeam.teamMemberRoles.harleenSachdevaRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: 'https://www.linkedin.com/in/ashish-pai-10499a12/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                //         }
                //     ]
                // },
                {
                    memberName: 'karmayogiTeam.teamMembers.samtaKumariSimmy',
                    imageLink: 'assets/aboutus/karmayogiTeam/samtaKumari.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.samtaKumariSimmyRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/cssamtaksimmy?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
                        }
                    ]
                },
                // {
                //     memberName: 'karmayogiTeam.teamMembers.hemantSharma',
                //     imageLink: 'assets/aboutus/karmayogiTeam/hemant.jpg',
                //     roles: 'karmayogiTeam.teamMemberRoles.hemantSharmaRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: ''
                //         }
                //     ]
                // },               
                {
                    memberName: 'karmayogiTeam.teamMembers.shobhanaRana',
                    imageLink: 'assets/aboutus/karmayogiTeam/shobhana.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.shobhanaRanaRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/shobhana-rana-59a48092?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.riteshKumar',
                    imageLink: 'assets/aboutus/karmayogiTeam/ritesh.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.riteshKumarRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                // {
                //     memberName: 'karmayogiTeam.teamMembers.rahulRanjan',
                //     imageLink: 'assets/aboutus/karmayogiTeam/rahulRanjan.jpg',
                //     roles: 'karmayogiTeam.teamMemberRoles.rahulRanjanRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: ''
                //         }
                //     ]
                // },
                // {
                //     memberName: 'karmayogiTeam.teamMembers.rajatPratapSingh',
                //     imageLink: 'assets/aboutus/karmayogiTeam/rajatPratapSingh.jpg',
                //     roles: 'karmayogiTeam.teamMemberRoles.rajatPratapSinghRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: ''
                //         }
                //     ]
                // },
                {
                    memberName: 'karmayogiTeam.teamMembers.kailashChandra',
                    imageLink: 'assets/aboutus/karmayogiTeam/kailashChandra.png',
                    roles: 'karmayogiTeam.teamMemberRoles.kailashChandraRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.soumiBanerjee',
                    imageLink: 'assets/aboutus/karmayogiTeam/soumiBanerjee.png',
                    roles: 'karmayogiTeam.teamMemberRoles.soumiBanerjeeRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.eshaKatiyar',
                    imageLink: 'assets/aboutus/karmayogiTeam/esha.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.eshaKatiyarRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/esha-katiyar-137a3571/'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.ankitaSondhi',
                    imageLink: 'assets/aboutus/karmayogiTeam/ankita.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.ankitaSondhiRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/ankita-sondhi/'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.akankshaSrivastava',
                    imageLink: 'assets/aboutus/karmayogiTeam/akankshaSrivastava.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.akankshaSrivastavaRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.dineshUpase',
                    imageLink: 'assets/aboutus/karmayogiTeam/image.png',
                    roles: 'karmayogiTeam.teamMemberRoles.dineshUpaseRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.syedMohdUzair',
                    imageLink: 'assets/aboutus/karmayogiTeam/syedMohdUzair.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.syedMohdUzairRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/syed-mohd-uzair-a82b98147/?originalSubdomain=in'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.siddhiMehndiratta',
                    imageLink: 'assets/aboutus/karmayogiTeam/siddhi.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.siddhiMehndirattaRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://x.com/shemusings?s=21'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/siddhi-mehndiratta-575409210?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                /* Pawan Kumar Pathak left the team */
                {
                    memberName: 'karmayogiTeam.teamMembers.vaibhavAgarwal',
                    imageLink: 'assets/aboutus/karmayogiTeam/vaibhav.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.vaibhavAgarwalRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/ashish-pai-10499a12/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                // {
                //     memberName: 'karmayogiTeam.teamMembers.rajeshKumar',
                //     imageLink: 'assets/aboutus/karmayogiTeam/rajesh.jpg',
                //     roles: 'karmayogiTeam.teamMemberRoles.rajeshKumarRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: 'https://www.linkedin.com/in/ashish-pai-10499a12/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                //         }
                //     ]
                // },
                {
                    memberName: 'karmayogiTeam.teamMembers.sahilJain',
                    imageLink: 'assets/aboutus/karmayogiTeam/sahilJain.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.sahilJainRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/ashish-pai-10499a12/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.shubhamGupta',
                    imageLink: 'assets/aboutus/karmayogiTeam/shubham.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.shubhamGuptaRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://x.com/gupta_shubham04/'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/shubhamgupta04/'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.pawanKumarPathak',
                    imageLink: 'assets/aboutus/karmayogiTeam/Pawan.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.pawanKumarPathakRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.abhimanyuSharma',
                    imageLink: 'assets/aboutus/karmayogiTeam/abhimanyuSharma.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.abhimanyuSharmaRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.vinayakSen',
                    imageLink: 'assets/aboutus/karmayogiTeam/vinayakSen.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.vinayakSenRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://twitter.com/ivankaynes'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/vinayak-sen?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.nidhi',
                    imageLink: 'assets/aboutus/karmayogiTeam/nidhi.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.nidhiRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'www.linkedin.com/in/nidhi-vaish-01362a167'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.muddukrishna',
                    imageLink: 'assets/aboutus/karmayogiTeam/muddukrishna.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.muddukrishnaRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: 'https://twitter.com/muddukrishna_?t=QJNuSUXQD7yN97UpQJCbKw&s=09'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/muddu-krishna-267a3898?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.henryArokiaRaj',
                    imageLink: 'assets/aboutus/karmayogiTeam/henryArokia.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.henryArokiaRajRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/henry-arokia-raj-0b8021249/'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.priyamvadaPallaviMishra',
                    imageLink: 'assets/aboutus/karmayogiTeam/priyamvadaPallaviMishra.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.priyamvadaPallaviMishraRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/dr-priyamvada-mishra-6181961bb?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                        }
                    ]
                },
                // {
                //     memberName: 'karmayogiTeam.teamMembers.amitSinghal',
                //     imageLink: 'assets/aboutus/karmayogiTeam/amitSinghal.jpg',
                //     roles: 'karmayogiTeam.teamMemberRoles.amitSinghalRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: 'https://www.linkedin.com/in/amit-singhal-15004b114'
                //         }
                //     ]
                // },
                {
                    memberName: 'karmayogiTeam.teamMembers.akshaySharma',
                    imageLink: 'assets/aboutus/karmayogiTeam/akshaySharma.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.akshaySharmaRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'http://www.linkedin.com/in/akshaysharma12' // NOSONAR
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.rakshandaSinghThakur',
                    imageLink: 'assets/aboutus/karmayogiTeam/rakshandaSingh.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.rakshandaSinghThakurRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ' https://twitter.com/RakshandaSing20'
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: 'https://www.linkedin.com/in/rakshanda-singh-thakur-007a451a4?trk=contact-info'
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.sheetal',
                    imageLink: 'assets/aboutus/karmayogiTeam/sheetal.png',
                    roles: 'karmayogiTeam.teamMemberRoles.sheetalRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.taranpalSingh',
                    imageLink: 'assets/aboutus/karmayogiTeam/taranpalSingh.png',
                    roles: 'karmayogiTeam.teamMemberRoles.taranpalSinghRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.nitikaDogra',
                    imageLink: 'assets/aboutus/karmayogiTeam/nitikaDogra.png',
                    roles: 'karmayogiTeam.teamMemberRoles.nitikaDograRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.suman',
                    imageLink: 'assets/aboutus/karmayogiTeam/suman.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.sumanRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.vishalTomer',
                    imageLink: 'assets/aboutus/karmayogiTeam/vishalTomer.jpg',
                    roles: 'karmayogiTeam.teamMemberRoles.vishalTomerRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.vivekRanjanPandey',
                    imageLink: 'assets/aboutus/karmayogiTeam/image.png',
                    roles: 'karmayogiTeam.teamMemberRoles.vivekRanjanPandeyRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.ajaySingh',
                    imageLink: 'assets/aboutus/karmayogiTeam/image.png',
                    roles: 'karmayogiTeam.teamMemberRoles.ajaySinghRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.priyankaKumari',
                    imageLink: 'assets/aboutus/karmayogiTeam/image.png',
                    roles: 'karmayogiTeam.teamMemberRoles.priyankaKumariRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.ladNimeshkumarBalavantbhai',
                    imageLink: 'assets/aboutus/karmayogiTeam/image.png',
                    roles: 'karmayogiTeam.teamMemberRoles.ladNimeshkumarBalavantbhaiRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.ashishKumar',
                    imageLink: 'assets/aboutus/karmayogiTeam/ashishKumar.png',
                    roles: 'karmayogiTeam.teamMemberRoles.ashishKumarRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.shaniKumar',
                    imageLink: 'assets/aboutus/karmayogiTeam/shaniKumar.png',
                    roles: 'karmayogiTeam.teamMemberRoles.shaniKumarRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.kamleshKumarYadav',
                    imageLink: 'assets/aboutus/karmayogiTeam/kamleshKumarYadav.png',
                    roles: 'karmayogiTeam.teamMemberRoles.kamleshKumarYadavRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.anbalaganArunRaja',
                    imageLink: 'assets/aboutus/karmayogiTeam/anbalaganArunRaja.png',
                    roles: 'karmayogiTeam.teamMemberRoles.anbalaganArunRajaRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.anjaliKumarBharadwaj',
                    imageLink: 'assets/aboutus/karmayogiTeam/anjaliKumarBharadwaj.png',
                    roles: 'karmayogiTeam.teamMemberRoles.anjaliKumarBharadwajRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.ashishThakran',
                    imageLink: 'assets/aboutus/karmayogiTeam/ashishThakran.png',
                    roles: 'karmayogiTeam.teamMemberRoles.ashishThakranRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.ranjanaTripathi',
                    imageLink: 'assets/aboutus/karmayogiTeam/ranjanaTripathi.png',
                    roles: 'karmayogiTeam.teamMemberRoles.ranjanaTripathiRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.reenaBhasin',
                    imageLink: 'assets/aboutus/karmayogiTeam/reenaBhasin.png',
                    roles: 'karmayogiTeam.teamMemberRoles.reenaBhasinRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.meenuPathak',
                    imageLink: 'assets/aboutus/karmayogiTeam/meenuPathak.png',
                    roles: 'karmayogiTeam.teamMemberRoles.meenuPathakRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.himanshu',
                    imageLink: 'assets/aboutus/karmayogiTeam/image.png',
                    roles: 'karmayogiTeam.teamMemberRoles.himanshuRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.rishabhJain',
                    imageLink: 'assets/aboutus/karmayogiTeam/image.png',
                    roles: 'karmayogiTeam.teamMemberRoles.rishabhJainRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.sunilKumar',
                    imageLink: 'assets/aboutus/karmayogiTeam/sunilKumar.png',
                    roles: 'karmayogiTeam.teamMemberRoles.sunilKumarRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.randhirKumarSingh',
                    imageLink: 'assets/aboutus/karmayogiTeam/randhirKumarSingh.png',
                    roles: 'karmayogiTeam.teamMemberRoles.randhirKumarSinghRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                {
                    memberName: 'karmayogiTeam.teamMembers.anjaliSikarwar',
                    imageLink: 'assets/aboutus/karmayogiTeam/anjaliSikarwar.png',
                    roles: 'karmayogiTeam.teamMemberRoles.anjaliSikarwarRoles',
                    socialMedia: [
                        {
                            iconLink: 'assets/aboutus/twiter.svg',
                            navigationLink: ''
                        },
                        {
                            iconLink: 'assets/aboutus/linkedin.svg',
                            navigationLink: ''
                        }
                    ]
                },
                // {
                //     memberName: 'karmayogiTeam.teamMembers.sampadaSingh',
                //     imageLink: 'assets/aboutus/karmayogiTeam/sampada.jpg',
                //     roles: 'karmayogiTeam.teamMemberRoles.sampadaSinghRoles',
                //     socialMedia: [
                //         {
                //             iconLink: 'assets/aboutus/twiter.svg',
                //             navigationLink: ''
                //         },
                //         {
                //             iconLink: 'assets/aboutus/linkedin.svg',
                //             navigationLink: ''
                //         }
                //     ]
                // },
            ]
        }
    ]
};
export const TENDERS = {
    header: {
        headerText: `tender.title`,
        downloadPdf: `tender.downloadPdf`
    }
};
export const NOTIFICATIONS = {
    header: {
        headerText: `notifications.title`,
        downloadPdf: `notifications.downloadPdf`
    }
};
export const CAREER = {
    header: {
        headerText: `career.title`,
        p1: `career.paraText1`,
        p2: `career.paraText2`,
        headerPosition: `career.positionsText`
    },
    fieldText: {
        f1: `career.jobTitletext`,
        f2: `career.departmentText`,
        f3: `career.positionText`,
        btn1: `career.resetText`,
        btn2: `career.searchText`,
        downloadPdf: `career.downloadPdf`
    },
    placeholderText: {
        p1: `career.selectJobTitle`,
        p2: `career.selectDepartment`,
        p3: `career.selectPosition`
    },
    dataList: [
        {
            image: `assets/aboutus/about-new.JPG`,
        }
    ]
};
export const CONTACTUS = {
    header: {
        headertext1: `contact.titleText1`,
        headerText2: `contact.titletext2`
    },
    fieldText: {
        f1: `contact.fieldtext1`,
        f2: `contact.fieldtext2`,
        f3: `contact.fieldtext3`,
        f4: `contact.fieldtext4`,
        f5: `contact.fieldtext5`,
        f6: `contact.fieldtext6`,
        btn: `contact.fieldtext7`
    },
    contact: {
        h1: `contact.headtext`,
        address: `contact.addressText`,
        mail: `contact.mail`,
        number: `contact.numtext`,
        mailtext: `contact.mailtext`,
        numbertext: `contact.numbertext`,
        duration: `contact.duration`,
        slot: `contact.slot`,
        action: `contact.action`
    },
    placeholder: {
        placeholderText1: `contact.placeholderText1`,
        placeholderText2: `contact.placeholderText2`,
        placeholderText3: `contact.placeholderText3`,
        placeholderText4: `contact.placeholderText4`,
        placeholderText5: `contact.placeholderText5`
    }
};
export const TENDERS_KARMAYOGI = {
    header: {
        headerText: 'tenders.title'
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbnN0YW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbGlicmFyeS9zdW5iaXJkLWNiL2NicC1haS9zcmMvbGliL21vZHVsZXMvc2hhcmVkL2NvbnN0YW50L2FwcC5jb25zdGFudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUc7SUFDdkIsT0FBTyxFQUFFO1FBQ0wsV0FBVyxFQUFFLDZCQUE2QjtRQUMxQyxRQUFRLEVBQUUsdUJBQXVCO0tBQ3BDO0lBQ0QsWUFBWSxFQUFFO1FBQ1YsSUFBSSxFQUFFLG9CQUFvQjtRQUMxQixJQUFJLEVBQUUsaUJBQWlCO1FBQ3ZCLE9BQU8sRUFBRSxJQUFJO0tBQ2hCO0lBQ0QsVUFBVSxFQUFFO1FBQ1IsSUFBSSxFQUFFLGNBQWM7UUFDcEIsSUFBSSxFQUFFLGdCQUFnQjtRQUN0QixPQUFPLEVBQUUsSUFBSTtLQUNoQjtJQUNELElBQUksRUFBRTtRQUNGO1lBQ0ksSUFBSSxFQUFFLE9BQU87WUFDYixJQUFJLEVBQUUsT0FBTztZQUNiLElBQUksRUFBRSxXQUFXO1lBQ2pCLFFBQVEsRUFBRSxPQUFPO1NBQ3BCO0tBQ0o7SUFDRCxTQUFTLEVBQUU7UUFDUCxnQkFBZ0IsRUFBRTtZQUNkLE1BQU0sRUFBRSwrQkFBK0I7WUFDdkMsSUFBSSxFQUFFLEVBQUU7U0FDWDtRQUNELFVBQVUsRUFBRTtZQUNSO2dCQUNJLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxFQUFFO2dCQUNSLFFBQVEsRUFBRSxFQUFFO2FBQ2Y7WUFDRDtnQkFDSSxJQUFJLEVBQUUsbUJBQW1CO2dCQUN6QixJQUFJLEVBQUUsU0FBUztnQkFDZixRQUFRLEVBQUUsVUFBVTthQUN2QjtZQUNEO2dCQUNJLElBQUksRUFBRSxvQkFBb0I7Z0JBQzFCLElBQUksRUFBRSxHQUFHO2dCQUNULFFBQVEsRUFBRSxVQUFVO2FBQ3ZCO1lBQ0Q7Z0JB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QUM1QyxnQkFBZ0IsRUFBRSwwQkFBMEI7UUFDNUMsZ0JBQWdCLEVBQUUsMEJBQTBCO0tBQy9DO0NBQ0osQ0FBQTtBQUNELE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHO0lBQzdCLE1BQU0sRUFBRTtRQUNKLFVBQVUsRUFBRSxlQUFlO0tBQzlCO0NBQ0osQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBIRUFERVJfREFUQSA9IHtcbiAgICB3ZWxjb21lOiB7XG4gICAgICAgIHdlbGNvbWVUZXh0OiBgV0VMQ09NRSBUTyBLQVJNQVlPR0kgQkhBUkFUYCxcbiAgICAgICAgaW1hZ2VVcmw6IGAuL2Fzc2V0cy9pbWcvZmxhZy5zdmdgLFxuICAgIH0sXG4gICAga2FybWF5b2dpQnRuOiB7XG4gICAgICAgIHRleHQ6IGBLYXJtYXlvZ2kncyBDb3JuZXJgLFxuICAgICAgICBsaW5rOiBgL2xhdGVzdC11cGRhdGVzYCxcbiAgICAgICAgZGlzcGxheTogdHJ1ZVxuICAgIH0sXG4gICAgZG9ubG9hZEJ0bjoge1xuICAgICAgICB0ZXh0OiBgRG93bmxvYWQgYXBwYCxcbiAgICAgICAgbGluazogYCNpZ290TW9iaWxlYXBwYCxcbiAgICAgICAgZGlzcGxheTogdHJ1ZVxuICAgIH0sXG4gICAgYnRuczogW1xuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBg4KS54KS/4KSC4KSm4KWAYCxcbiAgICAgICAgICAgIGxpbms6IGBoaW5kaWAsXG4gICAgICAgICAgICB0eXBlOiBgdXBwZXJDYXNlYCxcbiAgICAgICAgICAgIGxhbmd1YWdlOiBgSGluZGlgXG4gICAgICAgIH1cbiAgICBdLFxuICAgIG5hdkhlYWRlcjoge1xuICAgICAgICBrYXJtYXlvZ2lCaGFyYXRoOiB7XG4gICAgICAgICAgICBpbWdTcmM6IGAvYXNzZXRzL2ltZy9rYXJtYXlvZ2lMb2dvLnN2Z2AsXG4gICAgICAgICAgICBsaW5rOiBgYFxuICAgICAgICB9LFxuICAgICAgICBuYXZCdXR0b25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGV4dDogYGAsXG4gICAgICAgICAgICAgICAgbGluazogYGAsXG4gICAgICAgICAgICAgICAgZnJhZ21lbnQ6ICcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBgdG9wTmF2QmFyLmFib3V0VXNgLFxuICAgICAgICAgICAgICAgIGxpbms6IGBhYm91dFVzYCxcbiAgICAgICAgICAgICAgICBmcmFnbWVudDogJ2Fib3V0X3VzJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGV4dDogYHRvcE5hdkJhci5uZXdzcm9vbWAsXG4gICAgICAgICAgICAgICAgbGluazogYC5gLFxuICAgICAgICAgICAgICAgIGZyYWdtZW50OiAnbmV3c3Jvb20nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBgdG9wTmF2QmFyLmNhcmVlcmAsXG4gICAgICAgICAgICAgICAgbGluazogYGNhcmVlcmAsXG4gICAgICAgICAgICAgICAgZnJhZ21lbnQ6ICdjYXJlZXInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBgdG9wTmF2QmFyLnRlbmRlcnNgLFxuICAgICAgICAgICAgICAgIGxpbms6IGB0ZW5kZXJzYCxcbiAgICAgICAgICAgICAgICBmcmFnbWVudDogJ3RlbmRlcnMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBgdG9wTmF2QmFyLm5vdGlmaWNhdGlvbnNgLFxuICAgICAgICAgICAgICAgIGxpbms6IGBub3RpZmljYXRpb25zYCxcbiAgICAgICAgICAgICAgICBmcmFnbWVudDogJ25vdGlmaWNhdGlvbnMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBgdG9wTmF2QmFyLmNvbnRhY3RVc2AsXG4gICAgICAgICAgICAgICAgbGluazogYGNvbnRhY3R1c2AsXG4gICAgICAgICAgICAgICAgZnJhZ21lbnQ6ICdjb250YWN0dXMnLFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIF0sXG4gICAgICAgIGxvZ2luQnRuOiB7XG4gICAgICAgICAgICB0ZXh0OiBgdG9wTmF2QmFyLmxvZ2luYCxcbiAgICAgICAgICAgIGxpbms6IGBwcm90ZWN0ZWQvdjgvcmVzb3VyY2VgXG4gICAgICAgIH0sXG4gICAgICAgIHJlZ2lzdGVyQnRuOiB7XG4gICAgICAgICAgICB0ZXh0OiBgdG9wTmF2QmFyLnJlZ2lzdGVyYCxcbiAgICAgICAgICAgIGxpbms6IGBwdWJsaWMvc2lnbnVwYCxcbiAgICAgICAgfSxcbiAgICAgICAgY29udGFjdExpbmsgOiB7XG4gICAgICAgICAgICB0ZXh0OiBgdG9wTmF2QmFyLmNvbnRhY3RVc2AsXG4gICAgICAgICAgICBsaW5rOiBgY29udGFjdHVzYCxcbiAgICAgICAgICAgIGZyYWdtZW50OiAnY29udGFjdHVzJyxcbiAgICAgICAgfVxuICAgIH0sXG59XG5cbmV4cG9ydCBjb25zdCBEQVNIQk9BUkRfQU5BTFlUSUNTX0xJU1QgPSBbXG4gICAge1xuICAgICAgICBkYXNoYm9hcmVkSGVhZGVyOiBgTnVtYmVyIG9mIHVzZXJzL01ETydzYCxcbiAgICAgICAgYW5hbHl0aWNzTGlzdDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGltZ1NyYzogYC4vYXNzZXRzL2ltZy9sZWFybnNHcmFwaC5zdmdgLFxuICAgICAgICAgICAgICAgIGNvdW50OiBgMGAsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGBLYXJtYXlvZ2lzIG9uYm9hcmRlZGAsXG4gICAgICAgICAgICAgICAgYWx0OiBgbGVhcm5zIHJlY29yZGAsXG4gICAgICAgICAgICAgICAgaWQ6IGBrYXJtYXlvZ2lPbmJvYXJkZWRgXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgaW1nU3JjOiBgLi9hc3NldHMvaW1nL2xlYXJuc0dyYXBoLnN2Z2AsXG4gICAgICAgICAgICAgICAgY291bnQ6IGAwYCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogYFJlZ2lzdGVyZWQgTURPJ3NgLFxuICAgICAgICAgICAgICAgIGFsdDogYGxlYXJucyByZWNvcmRgLFxuICAgICAgICAgICAgICAgIGlkOiBgcmVnaXN0ZXJlZE1kb2BcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgZGFzaGJvYXJlZEhlYWRlcjogYEF2YWlsYWJsZSBjb250ZW50YCxcbiAgICAgICAgYW5hbHl0aWNzTGlzdDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGltZ1NyYzogYC4vYXNzZXRzL2ltZy9jb3Vyc2VzR3JhcGguc3ZnYCxcbiAgICAgICAgICAgICAgICBjb3VudDogYDBgLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgQ291cnNlc2AsXG4gICAgICAgICAgICAgICAgYWx0OiBgQ291cnNlcyByZWNvcmRgLFxuICAgICAgICAgICAgICAgIGlkOiBgY291cnNlc2BcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBpbWdTcmM6IGAuL2Fzc2V0cy9pbWcvY29udGVudEdyYXBoLnN2Z2AsXG4gICAgICAgICAgICAgICAgY291bnQ6IGAwYCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogYEF2YWlsYWJsZSBjb250ZW50IChob3VycylgLFxuICAgICAgICAgICAgICAgIGFsdDogYENvbnRlbnQgcmVjb3JkYCxcbiAgICAgICAgICAgICAgICBpZDogYGF2YWlsYWJsZUNvbnRlbnRgXG4gICAgICAgICAgICB9LFxuICAgICAgICBdXG4gICAgfVxuXVxuXG5leHBvcnQgY29uc3QgRkVBVFVSRVNfQ09VUlNFUyA9IHtcbiAgICBoZWFkZXI6IHtcbiAgICAgICAgaGVhZGVyVGV4dDogYGNvdXJzZXMuc2hvd2Nhc2VkQ291cnNlc2AsXG4gICAgICAgIHR5cGU6IGBmZWF0dXJlZC1jb3Vyc2VzYCxcbiAgICAgICAgc2hvd0FsbDogYGNvdXJzZXMuc2hvd0FsbGBcbiAgICB9LFxuICAgIGRhdGFMaXN0OiBbXSxcblxufVxuXG5leHBvcnQgY29uc3QgVEVTVElNT05JQUxTID0ge1xuICAgIGhlYWRlcjoge1xuICAgICAgICBoZWFkZXJUZXh0OiBgdGVzdGltb25pYWxgLFxuICAgICAgICB0eXBlOiBgdGVzdGltb25pYWxzYFxuICAgIH0sXG4gICAgZGF0YUxpc3Q6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgcG9zdGVySW1hZ2U6IGBhc3NldHMvdGVzdGltb25pYWxzL3Rlc3RpbW9uaWFsLTEud2VicGAsXG4gICAgICAgICAgICBuYW1lOiBgUHJlZXQgQmhhcmF0YCxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgaUdPVCBpcyBqdXN0IGxpa2UgYSBzZWVkIHRoYXQgaGFzIGJlZW4gcGxhbnRlZCB3aXRoIHRoZSBwb3RlbnRpYWwgdG8gZ3JvdyBpbnRvIGEgbWlnaHR5IHRyZWUgZm9yIHByb2dyZXNzIGFuZCBkZXZlbG9wbWVudCBvZiBuYXRpb24uIFdpdGggdGhlIHN1cHBvcnQgYW5kIG1vdGl2YXRpb24gZnJvbSBNRE9zLCB0aGlzIGluaXRpYXRpdmUgaGFzIHRoZSBwb3RlbnRpYWwgdG8gYmVhciB0aGUgdGFzdGllc3QgZnJ1aXRzIGZvciB0aGUgYmV0dGVybWVudCBvZiBzb2NpZXR5LiBNRE9zIGNhbiBudXJ0dXJlIHRoZSBwb3RlbnRpYWwgd2l0aGluIGluZGl2aWR1YWxzIGFuZCBlbXBvd2VyIHRoZW0gdG8gY29udHJpYnV0ZSBwb3NpdGl2ZWx5IHRvIHNvY2lldHkuXCJgLFxuICAgICAgICAgICAgZGVzaWc6IGBDUlBGYCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcG9zdGVySW1hZ2U6IGBhc3NldHMvdGVzdGltb25pYWxzL3Rlc3RpbW9uaWFsLTIud2VicGAsXG4gICAgICAgICAgICBuYW1lOiBgUHJlZXQgQmhhcmF0YCxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgaUdPVCBpcyBqdXN0IGxpa2UgYSBzZWVkIHRoYXQgaGFzIGJlZW4gcGxhbnRlZCB3aXRoIHRoZSBwb3RlbnRpYWwgdG8gZ3JvdyBpbnRvIGEgbWlnaHR5IHRyZWUgZm9yIHByb2dyZXNzIGFuZCBkZXZlbG9wbWVudCBvZiBuYXRpb24uIFdpdGggdGhlIHN1cHBvcnQgYW5kIG1vdGl2YXRpb24gZnJvbSBNRE9zLCB0aGlzIGluaXRpYXRpdmUgaGFzIHRoZSBwb3RlbnRpYWwgdG8gYmVhciB0aGUgdGFzdGllc3QgZnJ1aXRzIGZvciB0aGUgYmV0dGVybWVudCBvZiBzb2NpZXR5LiBNRE9zIGNhbiBudXJ0dXJlIHRoZSBwb3RlbnRpYWwgd2l0aGluIGluZGl2aWR1YWxzIGFuZCBlbXBvd2VyIHRoZW0gdG8gY29udHJpYnV0ZSBwb3NpdGl2ZWx5IHRvIHNvY2lldHkuXCJgLFxuICAgICAgICAgICAgZGVzaWc6IGBDUlBGYCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcG9zdGVySW1hZ2U6IGBhc3NldHMvdGVzdGltb25pYWxzL3Rlc3RpbW9uaWFsLTMud2VicGAsXG4gICAgICAgICAgICBuYW1lOiBgUHJlZXQgQmhhcmF0YCxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgaUdPVCBpcyBqdXN0IGxpa2UgYSBzZWVkIHRoYXQgaGFzIGJlZW4gcGxhbnRlZCB3aXRoIHRoZSBwb3RlbnRpYWwgdG8gZ3JvdyBpbnRvIGEgbWlnaHR5IHRyZWUgZm9yIHByb2dyZXNzIGFuZCBkZXZlbG9wbWVudCBvZiBuYXRpb24uIFdpdGggdGhlIHN1cHBvcnQgYW5kIG1vdGl2YXRpb24gZnJvbSBNRE9zLCB0aGlzIGluaXRpYXRpdmUgaGFzIHRoZSBwb3RlbnRpYWwgdG8gYmVhciB0aGUgdGFzdGllc3QgZnJ1aXRzIGZvciB0aGUgYmV0dGVybWVudCBvZiBzb2NpZXR5LiBNRE9zIGNhbiBudXJ0dXJlIHRoZSBwb3RlbnRpYWwgd2l0aGluIGluZGl2aWR1YWxzIGFuZCBlbXBvd2VyIHRoZW0gdG8gY29udHJpYnV0ZSBwb3NpdGl2ZWx5IHRvIHNvY2lldHkuXCJgLFxuICAgICAgICAgICAgZGVzaWc6IGBDUlBGYCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcG9zdGVySW1hZ2U6IGBhc3NldHMvdGVzdGltb25pYWxzL3Rlc3RpbW9uaWFsLTQud2VicGAsXG4gICAgICAgICAgICBuYW1lOiBgUHJlZXQgQmhhcmF0YCxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgaUdPVCBpcyBqdXN0IGxpa2UgYSBzZWVkIHRoYXQgaGFzIGJlZW4gcGxhbnRlZCB3aXRoIHRoZSBwb3RlbnRpYWwgdG8gZ3JvdyBpbnRvIGEgbWlnaHR5IHRyZWUgZm9yIHByb2dyZXNzIGFuZCBkZXZlbG9wbWVudCBvZiBuYXRpb24uIFdpdGggdGhlIHN1cHBvcnQgYW5kIG1vdGl2YXRpb24gZnJvbSBNRE9zLCB0aGlzIGluaXRpYXRpdmUgaGFzIHRoZSBwb3RlbnRpYWwgdG8gYmVhciB0aGUgdGFzdGllc3QgZnJ1aXRzIGZvciB0aGUgYmV0dGVybWVudCBvZiBzb2NpZXR5LiBNRE9zIGNhbiBudXJ0dXJlIHRoZSBwb3RlbnRpYWwgd2l0aGluIGluZGl2aWR1YWxzIGFuZCBlbXBvd2VyIHRoZW0gdG8gY29udHJpYnV0ZSBwb3NpdGl2ZWx5IHRvIHNvY2lldHkuXCJgLFxuICAgICAgICAgICAgZGVzaWc6IGBDUlBGYCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcG9zdGVySW1hZ2U6IGBhc3NldHMvdGVzdGltb25pYWxzL3Rlc3RpbW9uaWFsLTUud2VicGAsXG4gICAgICAgICAgICBuYW1lOiBgUHJlZXQgQmhhcmF0YCxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgaUdPVCBpcyBqdXN0IGxpa2UgYSBzZWVkIHRoYXQgaGFzIGJlZW4gcGxhbnRlZCB3aXRoIHRoZSBwb3RlbnRpYWwgdG8gZ3JvdyBpbnRvIGEgbWlnaHR5IHRyZWUgZm9yIHByb2dyZXNzIGFuZCBkZXZlbG9wbWVudCBvZiBuYXRpb24uIFdpdGggdGhlIHN1cHBvcnQgYW5kIG1vdGl2YXRpb24gZnJvbSBNRE9zLCB0aGlzIGluaXRpYXRpdmUgaGFzIHRoZSBwb3RlbnRpYWwgdG8gYmVhciB0aGUgdGFzdGllc3QgZnJ1aXRzIGZvciB0aGUgYmV0dGVybWVudCBvZiBzb2NpZXR5LiBNRE9zIGNhbiBudXJ0dXJlIHRoZSBwb3RlbnRpYWwgd2l0aGluIGluZGl2aWR1YWxzIGFuZCBlbXBvd2VyIHRoZW0gdG8gY29udHJpYnV0ZSBwb3NpdGl2ZWx5IHRvIHNvY2lldHkuXCJgLFxuICAgICAgICAgICAgZGVzaWc6IGBDUlBGYCxcbiAgICAgICAgfSxcbiAgICBdLFxufVxuXG5leHBvcnQgY29uc3QgTkVXU1JPT01fQ09VUlNFUyA9IHtcbiAgICBoZWFkZXI6IHtcbiAgICAgICAgaGVhZGVyVGV4dDogYG5ld3NSb29tYCxcbiAgICAgICAgdHlwZTogYG5ld3Mtcm9vbWBcbiAgICB9LFxuICAgIGRhdGFMaXN0OiBbXSxcbiAgICBsb2NhbERhdGFMaXN0OiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBvc3RlckltYWdlOiBgLi9hc3NldHMvbmV3c3Jvb20vbmV3c2xldHRlci0xLmpwZ2AsXG4gICAgICAgICAgICBuYW1lOiBgVm9sdW1lIDEgSXNzdWUgOSggT2N0b2JlciAtIE5vdmVtYmVyIDIwMjMpYCxcbiAgICAgICAgICAgIGRvd25sb2FkTGluazogJy4vYXNzZXRzL25ld3Nyb29tL25ld3MtbGV0dGVyLXBkZi9KYW51YXJ5IE5ld3NsZXR0ZXJfRmluYWwgMi5wZGYnLFxuICAgICAgICAgICAgYnV0dG9uOiBgRG93bmxvYWQgUERGYCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcG9zdGVySW1hZ2U6IGAuL2Fzc2V0cy9uZXdzcm9vbS9uZXdzbGV0dGVyLTIuanBnYCxcbiAgICAgICAgICAgIG5hbWU6IGBWb2x1bWUgMSBJc3N1ZSA5KCBPY3RvYmVyIC0gTm92ZW1iZXIgMjAyMylgLFxuICAgICAgICAgICAgZG93bmxvYWRMaW5rOiAnLi9hc3NldHMvbmV3c3Jvb20vbmV3cy1sZXR0ZXItcGRmL05ld3NsZXR0ZXIgWWVhciBFZGl0aW9uLnBkZicsXG4gICAgICAgICAgICBidXR0b246IGBEb3dubG9hZCBQREZgLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwb3N0ZXJJbWFnZTogYC4vYXNzZXRzL25ld3Nyb29tL25ld3NsZXR0ZXItMy5wbmdgLFxuICAgICAgICAgICAgbmFtZTogYFZvbHVtZSAxIElzc3VlIDkoIE9jdG9iZXIgLSBOb3ZlbWJlciAyMDIzKWAsXG4gICAgICAgICAgICBkb3dubG9hZExpbms6ICcuL2Fzc2V0cy9uZXdzcm9vbS9uZXdzLWxldHRlci1wZGYvTmV3c2xldHRlciBEZWNlbWJlci5wZGYnLFxuICAgICAgICAgICAgYnV0dG9uOiBgRG93bmxvYWQgUERGYCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcG9zdGVySW1hZ2U6IGAuL2Fzc2V0cy9uZXdzcm9vbS9uZXdzbGV0dGVyLTQucG5nYCxcbiAgICAgICAgICAgIG5hbWU6IGBWb2x1bWUgMSBJc3N1ZSA5KCBPY3RvYmVyIC0gTm92ZW1iZXIgMjAyMylgLFxuICAgICAgICAgICAgZG93bmxvYWRMaW5rOiAnLi9hc3NldHMvbmV3c3Jvb20vbmV3cy1sZXR0ZXItcGRmL25vdi5wZGYnLFxuICAgICAgICAgICAgYnV0dG9uOiBgRG93bmxvYWQgUERGYCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcG9zdGVySW1hZ2U6IGAuL2Fzc2V0cy9uZXdzcm9vbS9uZXdzbGV0dGVyLTUuanBlZ2AsXG4gICAgICAgICAgICBuYW1lOiBgVm9sdW1lIDEgSXNzdWUgOSggT2N0b2JlciAtIE5vdmVtYmVyIDIwMjMpYCxcbiAgICAgICAgICAgIGRvd25sb2FkTGluazogJy4vYXNzZXRzL25ld3Nyb29tL25ld3MtbGV0dGVyLXBkZi9PY3RvYmVyX05ld3NsZXR0ZXIucGRmJyxcbiAgICAgICAgICAgIGJ1dHRvbjogYERvd25sb2FkIFBERmAsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBvc3RlckltYWdlOiBgLi9hc3NldHMvbmV3c3Jvb20vbmV3c2xldHRlci02LnBuZ2AsXG4gICAgICAgICAgICBuYW1lOiBgVm9sdW1lIDEgSXNzdWUgOSggT2N0b2JlciAtIE5vdmVtYmVyIDIwMjMpYCxcbiAgICAgICAgICAgIGRvd25sb2FkTGluazogJy4vYXNzZXRzL25ld3Nyb29tL25ld3MtbGV0dGVyLXBkZi9zZXAucGRmJyxcbiAgICAgICAgICAgIGJ1dHRvbjogYERvd25sb2FkIFBERmAsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBvc3RlckltYWdlOiBgLi9hc3NldHMvbmV3c3Jvb20vbmV3c2xldHRlci03LmpwZ2AsXG4gICAgICAgICAgICBuYW1lOiBgVm9sdW1lIDEgSXNzdWUgOSggT2N0b2JlciAtIE5vdmVtYmVyIDIwMjMpYCxcbiAgICAgICAgICAgIGRvd25sb2FkTGluazogJy4vYXNzZXRzL25ld3Nyb29tL25ld3MtbGV0dGVyLXBkZi9OZXdzbGV0dGVyIEF1Z3VzdC5wZGYnLFxuICAgICAgICAgICAgYnV0dG9uOiBgRG93bmxvYWQgUERGYCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcG9zdGVySW1hZ2U6IGAuL2Fzc2V0cy9uZXdzcm9vbS9uZXdzbGV0dGVyLTguanBnYCxcbiAgICAgICAgICAgIG5hbWU6IGBWb2x1bWUgMSBJc3N1ZSA5KCBPY3RvYmVyIC0gTm92ZW1iZXIgMjAyMylgLFxuICAgICAgICAgICAgZG93bmxvYWRMaW5rOiAnLi9hc3NldHMvbmV3c3Jvb20vbmV3cy1sZXR0ZXItcGRmL05ld3NsZXR0ZXIgSnVuZS1KdWx5LnBkZicsXG4gICAgICAgICAgICBidXR0b246IGBEb3dubG9hZCBQREZgLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwb3N0ZXJJbWFnZTogYC4vYXNzZXRzL25ld3Nyb29tL25ld3NsZXR0ZXItOS5wbmdgLFxuICAgICAgICAgICAgbmFtZTogYFZvbHVtZSAxIElzc3VlIDkoIE9jdG9iZXIgLSBOb3ZlbWJlciAyMDIzKWAsXG4gICAgICAgICAgICBkb3dubG9hZExpbms6ICcuL2Fzc2V0cy9uZXdzcm9vbS9uZXdzLWxldHRlci1wZGYvTmV3c2xldHRlciBNYXkucGRmJyxcbiAgICAgICAgICAgIGJ1dHRvbjogYERvd25sb2FkIFBERmAsXG4gICAgICAgIH0sXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIHBvc3RlckltYWdlOiBgLi9hc3NldHMvbmV3c3Jvb20vbmV3c2xldHRlci0xMC5qcGdgLFxuICAgICAgICAvLyAgICAgbmFtZTogYFZvbHVtZSAxIElzc3VlIDkoIE9jdG9iZXIgLSBOb3ZlbWJlciAyMDIzKWAsXG4gICAgICAgIC8vICAgICBkb3dubG9hZExpbms6ICcuL2Fzc2V0cy9uZXdzcm9vbS9uZXdzLWxldHRlci1wZGYvTmV3c2xldHRlcl9BcHJpbF82LnBkZicsXG4gICAgICAgIC8vICAgICBidXR0b246IGBEb3dubG9hZCBQREZgLFxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBwb3N0ZXJJbWFnZTogYC4vYXNzZXRzL25ld3Nyb29tL25ld3NsZXR0ZXItMTEuanBnYCxcbiAgICAgICAgLy8gICAgIG5hbWU6IGBWb2x1bWUgMSBJc3N1ZSA5KCBPY3RvYmVyIC0gTm92ZW1iZXIgMjAyMylgLFxuICAgICAgICAvLyAgICAgZG93bmxvYWRMaW5rOiAnLi9hc3NldHMvbmV3c3Jvb20vbmV3cy1sZXR0ZXItcGRmL01hcmNoIGwgVm9sMSBJIElzc3VlIDIucGRmJyxcbiAgICAgICAgLy8gICAgIGJ1dHRvbjogYERvd25sb2FkIFBERmAsXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIHBvc3RlckltYWdlOiBgLi9hc3NldHMvbmV3c3Jvb20vbmV3c2xldHRlci0xMi5qcGdgLFxuICAgICAgICAvLyAgICAgbmFtZTogYFZvbHVtZSAxIElzc3VlIDkoIE9jdG9iZXIgLSBOb3ZlbWJlciAyMDIzKWAsXG4gICAgICAgIC8vICAgICBkb3dubG9hZExpbms6ICcuL2Fzc2V0cy9uZXdzcm9vbS9uZXdzLWxldHRlci1wZGYvZmluYWwgbmV3c2xldHRlci5wZGYnLFxuICAgICAgICAvLyAgICAgYnV0dG9uOiBgRG93bmxvYWQgUERGYCxcbiAgICAgICAgLy8gfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcG9zdGVySW1hZ2U6IGAuL2Fzc2V0cy9uZXdzcm9vbS9uZXdzbGV0dGVyLTkucG5nYCxcbiAgICAgICAgICAgIG5hbWU6IGBBc3BpcmF0aW9uYWwgQmxvY2tzIFByb2dyYW1tZSBNb2R1bGUgTm93IExpdmUgT24gaUdPVCBLYXJtYXlvZ2kgUGxhdGZvcm1gLFxuICAgICAgICAgICAgZG93bmxvYWRMaW5rOiAnLi9hc3NldHMvbmV3c3Jvb20vbmV3cy1sZXR0ZXItcGRmL1BJQjE5NTY1NTUgKDIpLnBkZicsXG4gICAgICAgICAgICBidXR0b246IGBEb3dubG9hZCBQREZgLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwb3N0ZXJJbWFnZTogYC4vYXNzZXRzL25ld3Nyb29tL25ld3NsZXR0ZXItOS5wbmdgLFxuICAgICAgICAgICAgbmFtZTogYFdvcmtzaG9wIG9uIEFydCBvZiBMZWFkZXJzaGlwIENvbW11bmljYXRpb24gb3JnYW5pemVkIGJ5IEthcm1heW9naSBCaGFyYXRgLFxuICAgICAgICAgICAgZG93bmxvYWRMaW5rOiAnLi9hc3NldHMvbmV3c3Jvb20vbmV3cy1sZXR0ZXItcGRmL1BJQjE5NjU5NTkgKDEpLnBkZicsXG4gICAgICAgICAgICBidXR0b246IGBEb3dubG9hZCBQREZgLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwb3N0ZXJJbWFnZTogYC4vYXNzZXRzL25ld3Nyb29tL25ld3NsZXR0ZXItOS5wbmdgLFxuICAgICAgICAgICAgbmFtZTogYENvdXJzZXMgbGF1bmNoZWQgYnkgU2FzaGFzdHJhIFNlZW1hIEJhbCBub3cgTGl2ZSBvbiBpR09UIEthcm1heW9naSBwbGF0Zm9ybWAsXG4gICAgICAgICAgICBkb3dubG9hZExpbms6ICcuL2Fzc2V0cy9uZXdzcm9vbS9uZXdzLWxldHRlci1wZGYvUElCMTk2NjA4Ni5wZGYnLFxuICAgICAgICAgICAgYnV0dG9uOiBgRG93bmxvYWQgUERGYCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcG9zdGVySW1hZ2U6IGAuL2Fzc2V0cy9uZXdzcm9vbS9uZXdzbGV0dGVyLTkucG5nYCxcbiAgICAgICAgICAgIG5hbWU6IGBDZWxlYnJhdGluZyAxc3QgWWVhciBBbm5pdmVyc2FyeSBvZiBLYXJtYXlvZ2kgUHJhcmFtYmhgLFxuICAgICAgICAgICAgZG93bmxvYWRMaW5rOiAnLi9hc3NldHMvbmV3c3Jvb20vbmV3cy1sZXR0ZXItcGRmL0NlbGVicmF0aW5nIDFzdCBZZWFyIEFubml2ZXJzYXJ5IG9mIEthcm1heW9naSBQcmFyYW1iaC5wZGYnLFxuICAgICAgICAgICAgYnV0dG9uOiBgRG93bmxvYWQgUERGYCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcG9zdGVySW1hZ2U6IGAuL2Fzc2V0cy9uZXdzcm9vbS9uZXdzbGV0dGVyLTkucG5nYCxcbiAgICAgICAgICAgIG5hbWU6IGBBY2Nlc3NpYmlsaXR5IFdpZGdldCBsYXVuY2hlZCBvbiB0aGUgaUdPVCBLYXJtYXlvZ2kgUGxhdGZvcm0gb24gSW50ZXJuYXRpb25hbCBEYXkgb2YgUGVyc29ucyB3aXRoIERpc2FiaWxpdGllc2AsXG4gICAgICAgICAgICBkb3dubG9hZExpbms6ICcuL2Fzc2V0cy9uZXdzcm9vbS9uZXdzLWxldHRlci1wZGYvUHJlc3MgSW5mb3JtYXRpb24gQnVyZWF1LnBkZicsXG4gICAgICAgICAgICBidXR0b246IGBEb3dubG9hZCBQREZgLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwb3N0ZXJJbWFnZTogYC4vYXNzZXRzL25ld3Nyb29tL25ld3NsZXR0ZXItOS5wbmdgLFxuICAgICAgICAgICAgbmFtZTogYFNBTUFSVEggQ3VyYXRlZCBQcm9ncmFtcyBsYXVuY2hlZCBieSBLYXJtYXlvZ2kgQmhhcmF0IGFuZCBOSVRJIEFheW9nYCxcbiAgICAgICAgICAgIGRvd25sb2FkTGluazogJy4vYXNzZXRzL25ld3Nyb29tL25ld3MtbGV0dGVyLXBkZi9QSUIxOTkwODQwLnBkZicsXG4gICAgICAgICAgICBidXR0b246IGBEb3dubG9hZCBQREZgLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwb3N0ZXJJbWFnZTogYC4vYXNzZXRzL25ld3Nyb29tL25ld3NsZXR0ZXItOS5wbmdgLFxuICAgICAgICAgICAgbmFtZTogYERyLiBKaXRlbmRyYSBTaW5naCwgTWluaXN0ZXIgb2YgU3RhdGUgZm9yIFBlcnNvbm5lbCwgUHVibGljIEdyaWV2YW5jZXMgYW5kIFBlbnNpb25zICB0byBpbmF1Z3VyYXRlIEdvb2QgR292ZXJuYW5jZSBEYXkgb24gMjV0aCBEZWNlbWJlciwgMjAyM2AsXG4gICAgICAgICAgICBkb3dubG9hZExpbms6ICcuL2Fzc2V0cy9uZXdzcm9vbS9uZXdzLWxldHRlci1wZGYvUHJlc3MgSW5mb3JtYXRpb24gQnVyZWF1MS5wZGYnLFxuICAgICAgICAgICAgYnV0dG9uOiBgRG93bmxvYWQgUERGYCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcG9zdGVySW1hZ2U6IGAuL2Fzc2V0cy9uZXdzcm9vbS9uZXdzbGV0dGVyLTkucG5nYCxcbiAgICAgICAgICAgIG5hbWU6IGBVbmlvbiBNaW5pc3RlciBEciBKaXRlbmRyYSBTaW5naCBzYXlzLCBcIk1pc3Npb24gS2FybWF5b2dpXCIsIGxhdW5jaGVkIGJ5IFByaW1lIE1pbmlzdGVyIFNocmkgTmFyZW5kcmEgTW9kaSwgaGFkIGluc3RpdHV0aW9uYWxpc2VkIHRoZSBwcm9jZXNzIG9mIGNhcGFjaXR5IGJ1aWxkaW5nLCBwYXJ0aWN1bGFybHkgZm9yIHRoZSBiZW5lZml0IG9mIGNpdmlsIHNlcnZhbnRzYCxcbiAgICAgICAgICAgIGRvd25sb2FkTGluazogJy4vYXNzZXRzL25ld3Nyb29tL25ld3MtbGV0dGVyLXBkZi9QSUIxOTIxNDI5ICgxKS5wZGYnLFxuICAgICAgICAgICAgYnV0dG9uOiBgRG93bmxvYWQgUERGYCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcG9zdGVySW1hZ2U6IGAuL2Fzc2V0cy9uZXdzcm9vbS9uZXdzbGV0dGVyLTkucG5nYCxcbiAgICAgICAgICAgIG5hbWU6IGBQTSBkaXN0cmlidXRlcyBhYm91dCA3MSwwMDAgYXBwb2ludG1lbnQgbGV0dGVycyB0byBuZXdseSBpbmR1Y3RlZCByZWNydWl0cyB1bmRlciBSb3pnYXIgTWVsYWAsXG4gICAgICAgICAgICBkb3dubG9hZExpbms6ICcuL2Fzc2V0cy9uZXdzcm9vbS9uZXdzLWxldHRlci1wZGYvUHJlc3MgSW5mb3JtYXRpb24gQnVyZWF1Mi5wZGYnLFxuICAgICAgICAgICAgYnV0dG9uOiBgRG93bmxvYWQgUERGYCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcG9zdGVySW1hZ2U6IGAuL2Fzc2V0cy9uZXdzcm9vbS9uZXdzbGV0dGVyLTkucG5nYCxcbiAgICAgICAgICAgIG5hbWU6IGBQTSBkaXN0cmlidXRlcyBtb3JlIHRoYW4gMSBsYWtoIGFwcG9pbnRtZW50IGxldHRlcnMgdG8gbmV3bHkgaW5kdWN0ZWQgcmVjcnVpdHMgaW4gR292ZXJubWVudCBkZXBhcnRtZW50cyBhbmQgb3JnYW5pc2F0aW9ucyB1bmRlciBSb3pnYXIgTWVsYWAsXG4gICAgICAgICAgICBkb3dubG9hZExpbms6ICcuL2Fzc2V0cy9uZXdzcm9vbS9uZXdzLWxldHRlci1wZGYvUHJlc3MgSW5mb3JtYXRpb24gQnVyZWF1My5wZGYnLFxuICAgICAgICAgICAgYnV0dG9uOiBgRG93bmxvYWQgUERGYCxcbiAgICAgICAgfSxcbiAgICBdXG59XG5cbmV4cG9ydCBjb25zdCBUT1BfUFJPVklERVJTID0ge1xuICAgIGhlYWRlcjoge1xuICAgICAgICBoZWFkZXJUZXh0OiBgcGFydG5lcnNgLFxuICAgICAgICB0eXBlOiBgY29udGVudC1wcm92aWRlcnNgXG4gICAgfSxcbiAgICB0b3BQcm92aWRlcnNMaXN0OiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBvc3RlckltYWdlOiBgYXNzZXRzL3RvcF9wcm92aWRlcnMvQXBvbGl0aWNhbC5wbmdgLFxuICAgICAgICAgICAgbmFtZTogYEFwb2xpdGljYWxgLFxuICAgICAgICAgICAgY2xpZW50VXJsOiBgaHR0cHM6Ly9hcG9saXRpY2FsLmNvL2hvbWUvYFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwb3N0ZXJJbWFnZTogYGFzc2V0cy90b3BfcHJvdmlkZXJzL0xCU05BQS5wbmdgLFxuICAgICAgICAgICAgbmFtZTogYExCU05BQWAsXG4gICAgICAgICAgICBjbGllbnRVcmw6IGBodHRwczovL3BvcnRhbC5pZ290a2FybWF5b2dpLmdvdi5pbi9hcHAvbGVhcm4vYnJvd3NlLWJ5L3Byb3ZpZGVyL0xCU05BQS9hbGwtQ0JQYFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwb3N0ZXJJbWFnZTogYGFzc2V0cy90b3BfcHJvdmlkZXJzL0lTVE0ucG5nYCxcbiAgICAgICAgICAgIG5hbWU6IGBJU1RNYCxcbiAgICAgICAgICAgIGNsaWVudFVybDogYGh0dHBzOi8vcG9ydGFsLmlnb3RrYXJtYXlvZ2kuZ292LmluL2FwcC9sZWFybi9icm93c2UtYnkvcHJvdmlkZXIvSW5zdGl0dXRlIG9mIFNlY3JldGFyaWF0IFRyYWluaW5nIGFuZCBNYW5hZ2VtZW50L2FsbC1DQlBgXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBvc3RlckltYWdlOiBgYXNzZXRzL3RvcF9wcm92aWRlcnMvVWRlbXkucG5nYCxcbiAgICAgICAgICAgIG5hbWU6IGBVZGVteWAsXG4gICAgICAgICAgICBjbGllbnRVcmw6IGBodHRwczovL3d3dy51ZGVteS5jb20vYFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwb3N0ZXJJbWFnZTogYGFzc2V0cy90b3BfcHJvdmlkZXJzL0lTUk8ucG5nYCxcbiAgICAgICAgICAgIG5hbWU6IGBJU1JPYCxcbiAgICAgICAgICAgIGNsaWVudFVybDogYGh0dHBzOi8vd3d3Lmlzcm8uZ292LmluL2BcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcG9zdGVySW1hZ2U6IGBhc3NldHMvdG9wX3Byb3ZpZGVycy9NaWNyb3NvZnQucG5nYCxcbiAgICAgICAgICAgIG5hbWU6IGBNaWNyb3NvZnRgLFxuICAgICAgICAgICAgY2xpZW50VXJsOiBgaHR0cHM6Ly9wb3J0YWwuaWdvdGthcm1heW9naS5nb3YuaW4vYXBwL2xlYXJuL2Jyb3dzZS1ieS9wcm92aWRlci9NaWNyb3NvZnQvYWxsLUNCUGBcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcG9zdGVySW1hZ2U6IGBhc3NldHMvdG9wX3Byb3ZpZGVycy9LYXJtYXlvZ2kgQmhhcmF0LnBuZ2AsXG4gICAgICAgICAgICBuYW1lOiBgS2FybWF5b2dpIEJoYXJhdGAsXG4gICAgICAgICAgICBjbGllbnRVcmw6IGBodHRwczovL2thcm1heW9naWJoYXJhdC5nb3YuaW4vYFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwb3N0ZXJJbWFnZTogYGFzc2V0cy90b3BfcHJvdmlkZXJzL1NWUE5QQS5wbmdgLFxuICAgICAgICAgICAgbmFtZTogYFNWUE5QQWAsXG4gICAgICAgICAgICBjbGllbnRVcmw6IGBodHRwczovL3BvcnRhbC5pZ290a2FybWF5b2dpLmdvdi5pbi9hcHAvbGVhcm4vYnJvd3NlLWJ5L3Byb3ZpZGVyL1NWUE5QQS9hbGwtQ0JQYFxuICAgICAgICB9LFxuICAgIF1cbn1cblxuZXhwb3J0IGNvbnN0IEFCT1VUX1VTID0ge1xuICAgIGhlYWRlcjoge1xuICAgICAgICBoZWFkZXJUZXh0OiBgdG9wTmF2QmFyLmFib3V0VXNgLFxuICAgICAgICBwMTogYEthcm1heW9naSBCaGFyYXQsIGEgU3BlY2lhbCBQdXJwb3NlIFZlaGljbGUgKFNQViksIGlzIGEgY3J1Y2lhbCBwYXJ0IG9mIHRoaXMgZnJhbWV3b3JrLiBJdCB3YXMgaW5jb3Jwb3JhdGVkIG9uIDMxLjAxLjIwMjIgdW5kZXIgU2VjdGlvbiA4IG9mIHRoZSBDb21wYW5pZXMgQWN0LCAyMDEzIGFzIGEgMTAwJSBHb3Zlcm5tZW50IG93bmVkIG5vdC1mb3ItcHJvZml0IENvYCxcbiAgICAgICAgcDI6IGBJdHMgcmVzcG9uc2liaWxpdHkgaXMgdG8gb3BlcmF0ZSBhbmQgbWFuYWdlIHRoZSBpR09UIEthcm1heW9naSBwbGF0Zm9ybSwgZW5zdXJpbnRpbWV3aGVyZS1kcWV2aWNlIGxlYXJuaW5nIGZvciBjaXZpbCBzZXJ2aWNlIG9mZmljaWFscyB0byBlbmhhbmNlIHRoZWlyIGNvbXBldGVuY3kuIFRoZSBTUFYgd2lsbCBvd24sIG1hbmFnZSwgbWFpbnRhaW4sIGFuZCBpbXByb3ZlIHRoZSBkaWdpdGFsIGFzc2V0cywgaW5jbHVkaW5nIHRoZSBJUFIgb2YgYWxsIHNvZnR3YXJlLCBjb250ZW50LCBwcm9jZXNzIGV0Yy4gb24gYmVoYWxmIG9mIHRoZSBHb3Zlcm5tZW50IHdpdGggYW4gYW5udWFsIHN1YnNjcmlwdGlvbi1iYXNlZCByZXZlbnVlIG1vZGVsLmAsXG4gICAgICAgIHAzOiBgSXRzIHJlc3BvbnNpYmlsaXR5IGlzIHRvIG9wZXJhdGUgYW5kIG1hbmFnZSB0aGUgaUdPVCBLYXJtYXlvZ2kgcGxhdGZvcm0sIGVuc3VyaW50aW1ld2hlcmUtZHFldmljZSBsZWFybmluZyBmb3IgY2l2aWwgc2VydmljZSBvZmZpY2lhbHMgdG8gZW5oYW5jZSB0aGVpciBjb21wZXRlbmN5LiBUaGUgU1BWIHdpbGwgb3duLCBtYW5hZ2UsIG1haW50YWluLCBhbmQgaW1wcm92ZSB0aGUgZGlnaXRhbCBhc3NldHMsIGluY2x1ZGluZyB0aGUgSVBSIG9mIGFsbCBzb2Z0d2FyZSwgY29udGVudCwgcHJvY2VzcyBldGMuIG9uIGJlaGFsZiBvZiB0aGUgR292ZXJubWVudCB3aXRoIGFuIGFubnVhbCBzdWJzY3JpcHRpb24tYmFzZWQgcmV2ZW51ZSBtb2RlbC5gLFxuICAgICAgICB0eXBlOiBcImFib3V0LXVzXCJcbiAgICB9LFxuICAgIGRhdGFMaXN0OiBbe1xuICAgICAgICBpbWFnZTogYGFzc2V0cy9hYm91dHVzL2Fib3V0LW5ldy5KUEdgLFxuICAgIH1cbiAgICBdXG59XG5cbmV4cG9ydCBjb25zdCBWSURFT19DT05GID0ge1xuICAgIHRpdGxlOiBgY29uZmVyZW5jZS50aXRsZWAsXG4gICAgdGh1bWJuYWlsOiBgYXNzZXRzL3ZpZGVvY29uZmVyZW5jZS90aHVtYm5haWwucG5nYCxcbiAgICB0ZXh0OiBgY29uZmVyZW5jZS5zdXBwb3J0YCxcbiAgICBkYXRlOiBgY29uZmVyZW5jZS5kdXJhdGlvbmAsXG4gICAgdGltZTogYGNvbmZlcmVuY2Uuc2xvdGAsXG4gICAgYnV0dG9uOiBgY29uZmVyZW5jZS5hY3Rpb25gLFxuICAgIGpvaW5MaW5rOiBcImh0dHBzOi8vdGVhbXMubWljcm9zb2Z0LmNvbS9sL21lZXR1cC1qb2luLzE5JTNhbWVldGluZ19NMlkzWkRFMlpETXRNV1F3WVMwME9XUXpMV0UzTkRjdE5EUmtOVGRqT0dJNFl6bGwlNDB0aHJlYWQudjIvMD9jb250ZXh0PSU3YiUyMlRpZCUyMiUzYSUyMjQwY2ZiNjVjLTliNzEtNDM1Zi04YmMyLWJjMmM2OWRmMWFjYSUyMiUyYyUyMk9pZCUyMiUzYSUyMmNiZDM3YmM5LTVjMzMtNDAxZi1iNTkwLTlkZWNiM2MzNzBmOCUyMiU3ZFwiLFxuICAgIHRlY2huaWNhbFN1cHBvcnQ6IGBjb25mZXJlbmNlLnRlY2huaWNhbFN1cHBvcnRgLFxuICAgIHBsc0NvbnRhY3Q6IGBjb25mZXJlbmNlLnBsc0NvbnRhY3RgXG59XG5cbmV4cG9ydCBjb25zdCBQSE9UT19HQUxMQVJZID0ge1xuICAgIGhlYWRlcjoge1xuICAgICAgICBoZWFkZXJUZXh0OiBgZ2FsbGVyeS5waG90b0dhbGxlcnlgLFxuICAgICAgICB0eXBlOiBgcGhvdG8tZ2FsbGFyeWBcbiAgICB9LFxuICAgIGdhbGxlcnlMaXN0OiBbXG4gICAgICAgIHsgbmFtZTogXCJSZWN0YW5nbGUxXCIsIHNyYzogXCJhc3NldHMvcGhvdG9zX2dhbGxlcnkvUmVjdGFuZ2xlMS5wbmdcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiUmVjdGFuZ2xlMlwiLCBzcmM6IFwiYXNzZXRzL3Bob3Rvc19nYWxsZXJ5L1JlY3RhbmdsZTIucG5nXCIgfSxcbiAgICAgICAgeyBuYW1lOiBcIlJlY3RhbmdsZTNcIiwgc3JjOiBcImFzc2V0cy9waG90b3NfZ2FsbGVyeS9SZWN0YW5nbGUzLnBuZ1wiIH0sXG4gICAgICAgIHsgbmFtZTogXCJSZWN0YW5nbGU0XCIsIHNyYzogXCJhc3NldHMvcGhvdG9zX2dhbGxlcnkvUmVjdGFuZ2xlNC5wbmdcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiUmVjdGFuZ2xlNFwiLCBjbG91ZFN0b3JhZ2VLZXk6IFwiYXNzZXRzL3Bob3Rvc19nYWxsZXJ5LzkwNTljOTIyLTQwYTUtNGE1MS05MWFlLWFmOWFiZWNiY2I3Yi5qcGVnXCIgfSxcbiAgICAgICAgeyBuYW1lOiBcIlJlY3RhbmdsZTRcIiwgY2xvdWRTdG9yYWdlS2V5OiBcImFzc2V0cy9waG90b3NfZ2FsbGVyeS8zMzI0NzAyMzVfNDcwNDE3ODE4NTA2NDE3XzY5ODk4ODc0OTczMjg3ODI5MDlfbi5qcGdcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiUmVjdGFuZ2xlNFwiLCBjbG91ZFN0b3JhZ2VLZXk6IFwiYXNzZXRzL3Bob3Rvc19nYWxsZXJ5LzMzMjQ4OTcyN183NDI3NzE2OTM5MjkzNjVfNzQ1MTA5NTA3MTM2OTkzNTQ4NF9uICgxKS5qcGdcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiUmVjdGFuZ2xlNFwiLCBjbG91ZFN0b3JhZ2VLZXk6IFwiYXNzZXRzL3Bob3Rvc19nYWxsZXJ5LzM0NDA2MTU2Ml8xNDYzNTgyODgwODQ0NDYzXzI4MTM0OTMxOTcwNDA1OTM5ODlfbi5qcGdcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiUmVjdGFuZ2xlNFwiLCBjbG91ZFN0b3JhZ2VLZXk6IFwiYXNzZXRzL3Bob3Rvc19nYWxsZXJ5LzM1Mzc3MjgyOF8xOTcyNjA4NTMyNzY2NzZfMjQyODE0NDg0OTA3NjI5NDEwNl9uLmpwZ1wiIH0sXG4gICAgICAgIHsgbmFtZTogXCJSZWN0YW5nbGU0XCIsIGNsb3VkU3RvcmFnZUtleTogXCJhc3NldHMvcGhvdG9zX2dhbGxlcnkvMzg3ODI2MDQzXzI3MTQ2NDg2MjUyMjk0MV84Mjg1ODcyMzA5NzAyMzMxMjcxX24uanBnXCIgfSxcbiAgICAgICAgeyBuYW1lOiBcIlJlY3RhbmdsZTRcIiwgY2xvdWRTdG9yYWdlS2V5OiBcImFzc2V0cy9waG90b3NfZ2FsbGVyeS80MDA2MjQzOTVfMjkwNzU0Mjk3MjYwNjY0XzczNjY2OTY2NDE0Mjg3NjAwMTFfbi5qcGdcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiUmVjdGFuZ2xlNFwiLCBjbG91ZFN0b3JhZ2VLZXk6IFwiYXNzZXRzL3Bob3Rvc19nYWxsZXJ5L2RmMWZmZTg1LTc2ZWUtNGZiMy04MzFiLTNlNmMyZjYyNzg1ZC5qcGdcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiUmVjdGFuZ2xlNFwiLCBjbG91ZFN0b3JhZ2VLZXk6IFwiYXNzZXRzL3Bob3Rvc19nYWxsZXJ5L0lNR18yMzAzLkpQR1wiIH0sXG4gICAgICAgIHsgbmFtZTogXCJSZWN0YW5nbGU0XCIsIGNsb3VkU3RvcmFnZUtleTogXCJhc3NldHMvcGhvdG9zX2dhbGxlcnkvUEhPVE8tMjAyNC0wMi0xOS0xNy0yOC00MS5qcGdcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiUmVjdGFuZ2xlNFwiLCBjbG91ZFN0b3JhZ2VLZXk6IFwiYXNzZXRzL3Bob3Rvc19nYWxsZXJ5L1BIT1RPLTIwMjQtMDItMTktMTctMjgtNDQuanBnXCIgfSxcbiAgICAgICAgeyBuYW1lOiBcIlJlY3RhbmdsZTRcIiwgY2xvdWRTdG9yYWdlS2V5OiBcImFzc2V0cy9waG90b3NfZ2FsbGVyeS9QSE9UTy0yMDI0LTAyLTE5LTE3LTI4LTQ1XzEuanBnXCIgfSxcbiAgICAgICAgeyBuYW1lOiBcIlJlY3RhbmdsZTRcIiwgY2xvdWRTdG9yYWdlS2V5OiBcImFzc2V0cy9waG90b3NfZ2FsbGVyeS9QSE9UTy0yMDI0LTAyLTE5LTE3LTI4LTQ1LmpwZ1wiIH0sXG4gICAgICAgIHsgbmFtZTogXCJSZWN0YW5nbGU0XCIsIGNsb3VkU3RvcmFnZUtleTogXCJhc3NldHMvcGhvdG9zX2dhbGxlcnkvUEhPVE8tMjAyNC0wMi0xOS0xNy0yOC00Ni5qcGdcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiUmVjdGFuZ2xlNFwiLCBjbG91ZFN0b3JhZ2VLZXk6IFwiYXNzZXRzL3Bob3Rvc19nYWxsZXJ5L1BIT1RPLTIwMjQtMDItMTktMTctMjgtNDdfMS5qcGdcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiUmVjdGFuZ2xlNFwiLCBjbG91ZFN0b3JhZ2VLZXk6IFwiYXNzZXRzL3Bob3Rvc19nYWxsZXJ5L1BIT1RPLTIwMjQtMDItMTktMTctMjgtNDcuanBnXCIgfSxcbiAgICAgICAgeyBuYW1lOiBcIlJlY3RhbmdsZTRcIiwgY2xvdWRTdG9yYWdlS2V5OiBcImFzc2V0cy9waG90b3NfZ2FsbGVyeS9QSE9UTy0yMDI0LTAyLTE5LTE3LTI4LTQ4LmpwZ1wiIH0sXG4gICAgICAgIHsgbmFtZTogXCJSZWN0YW5nbGU0XCIsIGNsb3VkU3RvcmFnZUtleTogXCJhc3NldHMvcGhvdG9zX2dhbGxlcnkvUEhPVE8tMjAyNC0wMi0xOS0xNy0yOC00OS5qcGdcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiUmVjdGFuZ2xlNFwiLCBjbG91ZFN0b3JhZ2VLZXk6IFwiYXNzZXRzL3Bob3Rvc19nYWxsZXJ5L1BIT1RPLTIwMjQtMDItMTktMTctMjgtNTAuanBnXCIgfSxcbiAgICBdXG59XG5cbmV4cG9ydCBjb25zdCBJR09OX1ZJU0lPTl9ERVRBSUxTID0ge1xuICAgIHZpc2lvbjoge1xuICAgICAgICBpbWdVcmw6IGAuL2Fzc2V0cy9pbWcvdmlzaW9uSW1nLnN2Z2AsXG4gICAgICAgIGFsdDogYEhvdyBkb2VzIHRoZSBwbGF0Zm9ybSBlbmFibGUgeW91IHRvIGJlY29tZSB0aGUgYmVzdCB2ZXJzaW9uIG9mIHlvdXJzZWxmP2AsXG4gICAgfSxcbiAgICB2aWRlb3M6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgcG9zdGVyOiBgLi9hc3NldHMvaW1nL3ZpZGVvMS5wbmdgLFxuICAgICAgICAgICAgdmlkZW9MaW5rOiBgLi9hc3NldHMvaW1nL1NhbmplZXYtZmluYWwubXA0YCxcbiAgICAgICAgICAgIGxpbmUxOiBgQW4gYCxcbiAgICAgICAgICAgIGxpbmUyOiBgZXhwZXJpZW5jZWRgLFxuICAgICAgICAgICAgbGluZTM6IGAgY2l2aWwgc2VydmFudGAsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBvc3RlcjogYC4vYXNzZXRzL2ltZy92aWRlbzIucG5nYCxcbiAgICAgICAgICAgIHZpZGVvTGluazogYC4vYXNzZXRzL2ltZy9TaGlscGEtZmluYWwubXA0YCxcbiAgICAgICAgICAgIGxpbmUxOiBgQSBgLFxuICAgICAgICAgICAgbGluZTI6IGBuZXdseWAsXG4gICAgICAgICAgICBsaW5lMzogYCByZWNydWl0ZWQgY2l2aWwgc2VydmFudGAsXG4gICAgICAgIH0sXG4gICAgXSxcblxufVxuZXhwb3J0IGNvbnN0IENPTkZFUkVOQ0VfREFUQSA9IHtcbiAgICB0aXRsZTogJ2NvbmZlcmVuY2UudGl0bGUnLFxuICAgIGRlc2NyaXB0aW9uOiAnY29uZmVyZW5jZS5zdXBwb3J0JyxcbiAgICB3b3JrZGF5czogJ2NvbmZlcmVuY2UuZHVyYXRpb24nLFxuICAgIHRpbWluZ3M6ICdjb25mZXJlbmNlLnNsb3QnLFxuICAgIGpvaW5Ob3c6ICdjb25mZXJlbmNlLmFjdGlvbidcbn1cblxuZXhwb3J0IGNvbnN0IFJFR0lTVEVSX0RFVEFJTFMgPSB7XG4gICAgbGluZU9uZTogYFRha2UgdGhlYCxcbiAgICBsaW5lVHdvOiBgZmlyc3Qgc3RlcGAsXG4gICAgbGluZVRocmVlOiBgIHRvd2FyZHMgbGVhcm5pbmdgLFxuICAgIHJlZ2lzdGVyQnRuOiB7XG4gICAgICAgIHRleHQ6IGBSZWdpc3RlciBOb3dgLFxuICAgICAgICBsaW5rOiBgcHVibGljL3NpZ251cGBcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBTT0xVVElPTlNfU1BBQ0UgPSB7XG4gICAgc29sdXRpb25TcGFjZUhlYWRlcjoge1xuICAgICAgICBsaW5lT25lOiBgU29sdXRpb25pbmcgc3BhY2VgLFxuICAgICAgICBsaW5lVHdvOiBgZm9yIGFsbCBvZiBHb3Zlcm5tZW50YCxcbiAgICB9LFxuICAgIHNvbHV0aW9uU3BhY2VzTGlzdDogW1xuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBgTGVhcm5pbmcgaHViYCxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgTGVhcndoZXJldGltZSBhbmQgYnJpZGdlIHlvdXIgY29tcGV0ZW5jeSBnYXBzIHVzaW5nIGltcGFjdGZ1bCBhbmQgZW5nYWdpbmcgbGVhcm5pbmcgY29udGVudC5gLFxuICAgICAgICAgICAgaW1nU3JjOiBgLi9hc3NldHMvaW1nL3NjaG9vbC5zdmdgLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBuYW1lOiBgRGlzY3Vzc2lvbiBodWJgLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGBEaXNjdXNzIGFuZCBsZWFybiB3aXRoIHBlZXJzLCBjb2xsZWFndWVzLCBjaXZpbCBzZXJ2YW50cyBhbmQgZXhwZXJ0cyBhY3Jvc3MgdGhlIGNvdW50cnkuYCxcbiAgICAgICAgICAgIGltZ1NyYzogYC4vYXNzZXRzL2ltZy9mb3J1bS5zdmdgLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBuYW1lOiBgTmV0d29yayBodWJgLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGBDb25uZWN0IHdpdGggY2l2aWwgc2VydmFudHMgYWNyb3NzIHRoZSBjb3VudHJ5LiBHcm93IHlvdXIgbmV0d29yayB3aXRoaW4gZ292ZXJubWVudCBjaXJjbGVzLmAsXG4gICAgICAgICAgICBpbWdTcmM6IGAuL2Fzc2V0cy9pbWcvZ3JvdXAuc3ZnYCxcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbmFtZTogYENvbXBldGVuY3kgaHViYCxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgSWRlbnRpZnkgeW91ciBjb21wZXRlbmN5IHJlcXVpcmVtZW50cywgY29tcGV0ZW5jeSBnYXBzLCBzbyB5b3UgY2FuIGdyb3cgZmFzdGVyIGluIHRoZSByaWdodCBkaXJlY3Rpb24uYCxcbiAgICAgICAgICAgIGltZ1NyYzogYC4vYXNzZXRzL2ltZy9leHRlbnNpb24uc3ZnYCxcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbmFtZTogYENhcmVlciBodWJgLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGBFeHBsb3JlIGNhcmVlciBvcHBvcnR1bml0aWVzIGFjcm9zcyB0aGUgY291bnRyeSBhbmQgc2lnbmFsIHlvdXIgZXhwZXJ0aXNlLmAsXG4gICAgICAgICAgICBpbWdTcmM6IGAuL2Fzc2V0cy9pbWcvd29yay5zdmdgLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBuYW1lOiBgRXZlbnQgaHViYCxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgRW5hYmxlIHNpbXVsdGFuZW91cyBpbnRlcmFjdGl2ZSBleHBlcmllbnRpYWwgYW5kIHBlZXIgbGVhcm5pbmcuYCxcbiAgICAgICAgICAgIGltZ1NyYzogYC4vYXNzZXRzL2ltZy9ldmVudC5zdmdgLFxuICAgICAgICB9LFxuICAgIF1cbn1cblxuZXhwb3J0IGNvbnN0IFFVSUNLX1dBTEtUSFJPVUdIX0RFVEFJTFMgPSB7XG4gICAgdmlkZW9MaW5rOiBgLi9hc3NldHMvaW1nL0thcm1heW9naUJoYXJhdFdhbGt0aHJvdWdoTmV3Lm1wNGAsXG4gICAgbGluZU9uZTogYEEgcXVpY2tgLFxuICAgIGxpbmVUd286IGAgd2Fsa3Rocm91Z2ggb2ZgLFxuICAgIGxpbmVUaHJlZTogYCB0aGUgYCxcbiAgICBsaW5lRm91cjogYCBLYXJtYXlvZ2kgQmhhcmF0YCxcbiAgICBsaW5lRml2ZTogYFBvcnRhbGAsXG59XG5cbmV4cG9ydCBjb25zdCBNT0JJTEVfQVBQX0RPV05MT0FEU19ERVRBSUxTID0ge1xuICAgIGRvd25sb2FkOiBgZG93bmxvYWRTZWN0aW9uLmRvd25sb2FkYCxcbiAgICBpR09UOiBgZG93bmxvYWRTZWN0aW9uLmlHb3RgLFxuICAgIGthcm1heW9naTogYGRvd25sb2FkU2VjdGlvbi5rYXJtYXlvZ2lgLFxuICAgIG1vYmlsZTogXCJkb3dubG9hZFNlY3Rpb24ubW9iaWxlXCIsXG4gICAgYXBwOiBcImRvd25sb2FkU2VjdGlvbi5hcHBcIixcbiAgICBkZXNjcmlwdGlvbjogYGRvd25sb2FkU2VjdGlvbi5kZXNjcmlwdGlvbmAsXG4gICAgc2Nhbm5lcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgbGluazogYGh0dHBzOi8vcGxheS5nb29nbGUuY29tL3N0b3JlL2FwcHMvZGV0YWlscz9pZD1jb20uaWdvdC5rYXJtYXlvZ2liaGFyYXQmcGxpPTFgLFxuICAgICAgICAgICAgaW1nU3JjOiBgLi9hc3NldHMvaW1nL0dvb2dsZV9QbGF5LUJhZGdlLUxvZ28ud2luZS5wbmdgLFxuICAgICAgICAgICAgc2Nhbm5lclNyYzogYC4vYXNzZXRzL2ltZy9zY2FuL3FyY29kZS5zdmdgLFxuICAgICAgICAgICAgdGV4dDogYGRvd25sb2FkU2VjdGlvbi5zY2FuVG9Eb3dubG9hZGAsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxpbms6IGBodHRwczovL2FwcHMuYXBwbGUuY29tL2luL2FwcC9pZ290LWthcm1heW9naS9pZDY0NDM5NDk0OTFgLFxuICAgICAgICAgICAgaW1nU3JjOiBgLi9hc3NldHMvaW1nL2Rvd25sb2FkLWFwcHN0b3JlLnBuZ2AsXG4gICAgICAgICAgICBzY2FubmVyU3JjOiBgLi9hc3NldHMvaW1nL3NjYW4vaU9TX3FyY29kZS5zdmdgLFxuICAgICAgICAgICAgdGV4dDogYGRvd25sb2FkU2VjdGlvbi5zY2FuVG9Eb3dubG9hZGAsXG4gICAgICAgIH0sXG4gICAgXSxcbiAgICBtb2NrdXBJbWdTcmM6IGAuL2Fzc2V0cy9pbWcvbW9iaWxlLWxhdGVzdC5wbmdgXG59XG5cbmV4cG9ydCBjb25zdCBNT0JJTEVfVklFV19BUFBfRE9XTkxPQURTX0RFVEFJTFMgPSB7XG4gICAgZ29vZ2xlU3RvcmU6IHtcbiAgICAgICAgaW1nU3JjOiBgLi9hc3NldHMvaW1nL0dvb2dsZV9QbGF5LUJhZGdlLUxvZ28ud2luZS5wbmdgLFxuICAgICAgICBsaW5rOiBgaHR0cHM6Ly9wbGF5Lmdvb2dsZS5jb20vc3RvcmUvYXBwcy9kZXRhaWxzP2lkPWNvbS5pZ290Lmthcm1heW9naWJoYXJhdCZwbGk9MWAsXG4gICAgfSxcbiAgICBhcHBsZVN0b3JlOiB7XG4gICAgICAgIGltZ1NyYzogYC4vYXNzZXRzL2ltZy9kb3dubG9hZC1hcHBzdG9yZS5wbmdgLFxuICAgICAgICBsaW5rOiBgaHR0cHM6Ly9hcHBzLmFwcGxlLmNvbS9pbi9hcHAvaWdvdC1rYXJtYXlvZ2kvaWQ2NDQzOTQ5NDkxYCxcbiAgICB9LFxuICAgIGxpbmVPbmU6IGBEb3dubG9hZCBpR09UIEthcm1heW9naSBgLFxuICAgIGxpbmVUd286IGBtb2JpbGUgYXBwYFxufVxuXG5leHBvcnQgY29uc3QgTkFWX0ZPT1RFUl9ERVRBSUxTID0ge1xuICAgIG5hdkxpbmtzOiBbXG4gICAgICAgIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBocmVmOiBgbmV3c3Jvb21gLFxuICAgICAgICAgICAgICAgIHRhcmdldDogYF9zZWxmYCxcbiAgICAgICAgICAgICAgICByb3V0ZXI6ICcvJyxcbiAgICAgICAgICAgICAgICBuYW1lOiBgZm9vdGVyTGlua3MubmV3c3Jvb21gLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBocmVmOiBgaHR0cHM6Ly9wb3J0YWwuaWdvdGthcm1heW9naS5nb3YuaW4vcHVibGljL2ZhcWAsXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiBgX3NlbGZgLFxuICAgICAgICAgICAgICAgIG5hbWU6IGBmb290ZXJMaW5rcy5mYXFgLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uOiAnZGlmZicsXG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaHJlZjogYGNvbnRhY3RfdXNgLFxuICAgICAgICAgICAgICAgIHRhcmdldDogYF9zZWxmYCxcbiAgICAgICAgICAgICAgICByb3V0ZXI6ICcvJyxcbiAgICAgICAgICAgICAgICBuYW1lOiBgZm9vdGVyTGlua3MuY29udGFjdFVzYFxuICAgICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaHJlZjogYG1kb1VzZXJMaXN0YCxcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IGBfc2VsZmAsXG4gICAgICAgICAgICAgICAgcm91dGVyOiBgbWRvTGlzdGAsXG4gICAgICAgICAgICAgICAgbmFtZTogYGZvb3RlckxpbmtzLm5vZGFsT2ZmaWNlYFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBocmVmOiBgbGF0ZXN0LXVwZGF0ZXNgLFxuICAgICAgICAgICAgICAgIHRhcmdldDogYF9zZWxmYCxcbiAgICAgICAgICAgICAgICByb3V0ZXI6ICdsYXRlc3QtdXBkYXRlcycsXG4gICAgICAgICAgICAgICAgbmFtZTogYGZvb3RlckxpbmtzLmthcm1heW9naUNvcm5lcmBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaHJlZjogYGh0dHBzOi8vcG9ydGFsLmlnb3RrYXJtYXlvZ2kuZ292LmluL3B1YmxpYy9zaWdudXBgLFxuICAgICAgICAgICAgICAgIHRhcmdldDogYF9zZWxmYCxcbiAgICAgICAgICAgICAgICBuYW1lOiBgdG9wTmF2QmFyLnJlZ2lzdGVyYCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbjogJ2RpZmYnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGhyZWY6IGBodHRwczovL2thcm1heW9naWJoYXJhdC5nb3YuaW4vYCxcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IGBfYmxhbmtgLFxuICAgICAgICAgICAgICAgIG5hbWU6IGBmb290ZXJMaW5rcy5taXNzaW9uS2FybWF5b2dpYFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBocmVmOiBgaHR0cHM6Ly9kb3B0Lmdvdi5pbi9gLFxuICAgICAgICAgICAgICAgIHRhcmdldDogYF9ibGFua2AsXG4gICAgICAgICAgICAgICAgbmFtZTogYGZvb3RlckxpbmtzLmRvcHRgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGhyZWY6IGBodHRwczovL2NiYy5nb3YuaW4vYCxcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IGBfYmxhbmtgLFxuICAgICAgICAgICAgICAgIG5hbWU6IGBmb290ZXJMaW5rcy5jcGNgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGhyZWY6IGBodHRwczovL3BvcnRhbC5pZ290a2FybWF5b2dpLmdvdi5pbi9wdWJsaWMvcHJpdmFjeS1wb2xpY3kvYCxcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IGBfYmxhbmtgLFxuICAgICAgICAgICAgICAgIG5hbWU6IGBmb290ZXJMaW5rcy5wcml2YWN5UG9saWN5YFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXVxuICAgIF0sXG4gICAgZm9sbG93VXM6ICdzb2NhaWxIdWIuZm9sbG93VXMnLFxuICAgIC8vIGNvcHlSaWdodHM6ICdDb3B5cmlnaHQgwqkgV2Vic2l0ZSBtYW5hZ2VkIGJ5IEthcm1heW9naSBCaGFyYXQuJyxcbiAgICAvLyBjb3B5UmlnaHRNb2JpbGU6ICdDb3B5cmlnaHQgwqkgV2Vic2l0ZSBtYW5hZ2VkIGJ5IEthcm1heW9naSBCaGFyYXQuJ1xuICAgIGNvcHlSaWdodHM6ICdDb3B5cmlnaHQnLFxuICAgIGNvcHlSaWdodE1vYmlsZTogJ0NvcHlyaWdodE1vYmlsZSdcbn1cbmV4cG9ydCBjb25zdCBOQVZfRk9PVEVSX0RFVEFJTFNfTU9CSUxFID0ge1xuICAgIHN1cHBvcnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgaHJlZjogYGh0dHBzOi8vcG9ydGFsLmlnb3RrYXJtYXlvZ2kuZ292LmluL3B1YmxpYy9mYXFgLFxuICAgICAgICAgICAgdGFyZ2V0OiBgX3NlbGZgLFxuICAgICAgICAgICAgbmFtZTogYGZvb3RlckxpbmtzLmZhcWAsXG4gICAgICAgICAgICBhcHBsaWNhdGlvbjogJ2RpZmYnLFxuXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGhyZWY6IGBjb250YWN0X3VzYCxcbiAgICAgICAgICAgIHRhcmdldDogYF9zZWxmYCxcbiAgICAgICAgICAgIHJvdXRlcjogJy8nLFxuICAgICAgICAgICAgbmFtZTogYGZvb3RlckxpbmtzLmNvbnRhY3RVc2BcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaHJlZjogYG1kb1VzZXJMaXN0YCxcbiAgICAgICAgICAgIHRhcmdldDogYF9zZWxmYCxcbiAgICAgICAgICAgIHJvdXRlcjogYG1kb0xpc3RgLFxuICAgICAgICAgICAgbmFtZTogYGZvb3RlckxpbmtzLm5vZGFsT2ZmaWNlYFxuICAgICAgICB9LFxuICAgIF0sXG4gICAgcmVsZWF0ZWQ6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgaHJlZjogYG5ld3Nyb29tYCxcbiAgICAgICAgICAgIHRhcmdldDogYF9zZWxmYCxcbiAgICAgICAgICAgIHJvdXRlcjogJy8nLFxuICAgICAgICAgICAgbmFtZTogYGZvb3RlckxpbmtzLm5ld3Nyb29tYCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaHJlZjogYGxhdGVzdC11cGRhdGVzYCxcbiAgICAgICAgICAgIHRhcmdldDogYF9zZWxmYCxcbiAgICAgICAgICAgIHJvdXRlcjogJ2xhdGVzdC11cGRhdGVzJyxcbiAgICAgICAgICAgIG5hbWU6IGBmb290ZXJMaW5rcy5rYXJtYXlvZ2lDb3JuZXJgXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGhyZWY6IGBodHRwczovL3BvcnRhbC5pZ290a2FybWF5b2dpLmdvdi5pbi9wdWJsaWMvc2lnbnVwYCxcbiAgICAgICAgICAgIHRhcmdldDogYF9zZWxmYCxcbiAgICAgICAgICAgIG5hbWU6IGB0b3BOYXZCYXIucmVnaXN0ZXJgLFxuICAgICAgICAgICAgYXBwbGljYXRpb246ICdkaWZmJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaHJlZjogYGh0dHBzOi8va2FybWF5b2dpYmhhcmF0Lmdvdi5pbi9gLFxuICAgICAgICAgICAgdGFyZ2V0OiBgX2JsYW5rYCxcbiAgICAgICAgICAgIG5hbWU6IGBmb290ZXJMaW5rcy5taXNzaW9uS2FybWF5b2dpYFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBocmVmOiBgaHR0cHM6Ly9kb3B0Lmdvdi5pbi9gLFxuICAgICAgICAgICAgdGFyZ2V0OiBgX2JsYW5rYCxcbiAgICAgICAgICAgIG5hbWU6IGBmb290ZXJMaW5rcy5kb3B0YFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBocmVmOiBgaHR0cHM6Ly9jYmMuZ292LmluL2AsXG4gICAgICAgICAgICB0YXJnZXQ6IGBfYmxhbmtgLFxuICAgICAgICAgICAgbmFtZTogYGZvb3RlckxpbmtzLmNwY2BcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaHJlZjogYGh0dHBzOi8vcG9ydGFsLmlnb3RrYXJtYXlvZ2kuZ292LmluL3B1YmxpYy9wcml2YWN5LXBvbGljeS9gLFxuICAgICAgICAgICAgdGFyZ2V0OiBgX2JsYW5rYCxcbiAgICAgICAgICAgIG5hbWU6IGBmb290ZXJMaW5rcy5wcml2YWN5UG9saWN5YFxuICAgICAgICB9LFxuICAgIF0sXG4gICAgZm9sbG93VXM6ICdzb2NhaWxIdWIuZm9sbG93VXMnLFxuICAgIGNvcHlSaWdodHM6ICdDb3B5cmlnaHQgwqkgV2Vic2l0ZSBtYW5hZ2VkIGJ5IEthcm1heW9naSBCaGFyYXQuJyxcbiAgICBjb3B5UmlnaHRNb2JpbGU6ICdDb3B5cmlnaHQgwqkgV2Vic2l0ZSBtYW5hZ2VkIGJ5IEthcm1heW9naSBCaGFyYXQuJ1xufVxuXG5leHBvcnQgY29uc3QgRk9PVEVSX0RFVEFJTFMgPSB7XG4gICAgY29weVJpZ2h0czogJ0NvcHlyaWdodCDCqSBXZWJzaXRlIG1hbmFnZWQgYnkgS2FybWF5b2dpIEJoYXJhdC4nXG59XG5cbmV4cG9ydCBjb25zdCBIT1dfVE9fQ0FSRF9MSVNUID0ge1xuICAgIGhlYWRlcjoge1xuICAgICAgICBoZWFkZXJUZXh0OiBgSG93IHRvYCxcbiAgICAgICAgdHlwZTogYGhvd3RvYFxuICAgIH0sXG4gICAgZGF0YUxpc3Q6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgdGl0bGU6ICdIb3cgdG8gUmVnaXN0ZXI/JywgbGluazogJycsIGljb246IFwiYXNzZXRzL2ltZy9ob3d0by9SZWN0YW5nbGUzLnBuZ1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRpdGxlOiAnSG93IHRvIExvZ2luPycsIGxpbms6ICcnLCBpY29uOiBcImFzc2V0cy9pbWcvaG93dG8vUmVjdGFuZ2xlMS5wbmdcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0aXRsZTogJ1BsYXRmb3JtIFdhbGt0aHJvdWdoJywgbGluazogJycsIGljb246IFwiYXNzZXRzL2ltZy9ob3d0by9SZWN0YW5nbGUyLnBuZ1wiXG4gICAgICAgIH1cbiAgICBdLFxufVxuXG5leHBvcnQgY29uc3QgSU5GT0NVU19DQVJEID0gW3tcbiAgICB2aWRlb0NhdGVnb3J5OiAnY291cnNlX2ludHJvJyxcbiAgICBoZWFkZXI6IHtcbiAgICAgICAgaGVhZGVyVGV4dDogYFZpZGVvIEdhbGxlcnlgLFxuICAgICAgICB0eXBlOiBgdmlkZW8tZ2FsbGVyeWBcbiAgICB9LFxuICAgIGRhdGFMaXN0OiBbXG4gICAgICAgIHtcblxuICAgICAgICB9XG4gICAgXVxufV1cblxuZXhwb3J0IGNvbnN0IFdIQVRfSVNfQ0FSRCA9IHtcbiAgICBoZWFkZXI6IHtcbiAgICAgICAgaGVhZGVyVGV4dDogYHdoYXQtaXNgLFxuICAgICAgICB0eXBlOiBgd2hhdC1pc2BcbiAgICB9LFxuICAgIGRhdGFMaXN0OiBbXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIGlkOiAnd2hhdElzSUdvdCcsXG4gICAgICAgIC8vICAgICBpbWdTcmM6IGBhc3NldHMvd2hhdGlzL2lnb3Qxc3R2aWRlby5qcGdgLFxuICAgICAgICAvLyAgICAgbmFtZTogJ3dhbGtUaHJvdWdoLndoYXRJc0lHb3QnLFxuICAgICAgICAvLyAgICAgbGluazogJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9Q2dTSE1iRWhmNkUnXG4gICAgICAgIC8vIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAnaG93VG9Mb2dpbkFuZFJlZ2lzdGVyJyxcbiAgICAgICAgICAgIGltZ1NyYzogYGFzc2V0cy93aGF0aXMvaG93dG9yZWdpc3Rlci5qcGdgLFxuICAgICAgICAgICAgbmFtZTogJ3dhbGtUaHJvdWdoLmhvd1RvTG9naW5BbmRSZWdpc3RlcicsXG4gICAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1NSDEyQWtWQnMzaydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgaWQ6ICdpZ290V2Fsa3Rocm91Z2gnLFxuICAgICAgICAgICAgaW1nU3JjOiBgYXNzZXRzL3doYXRpcy9SZWN0YW5nbGUzLnBuZ2AsXG4gICAgICAgICAgICBuYW1lOiAnd2Fsa1Rocm91Z2guaWdvdFdhbGt0aHJvdWdoJyxcbiAgICAgICAgICAgIGxpbms6ICdodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PW1hazdCUGVfMGpZJ1xuICAgICAgICB9XG4gICAgXSxcbn1cblxuZXhwb3J0IGNvbnN0IEZPT1RFUl9QUk9WSURFUiA9IFtcbiAgICB7IGhyZWY6ICdodHRwczovL2NiYy5nb3YuaW4vJywgc3JjOiBcImFzc2V0cy9mb290ZXItcHJvdmlkZXIvbmV3L2NhcGFjaXR5LWJ1aWxkaW5nLnN2Z1wiIH0sXG4gICAgeyBocmVmOiAnaHR0cHM6Ly93d3cuZGlnaXRhbGluZGlhLmdvdi5pbi8nLCBzcmM6IFwiYXNzZXRzL2Zvb3Rlci1wcm92aWRlci9uZXcvZGlnaXRhbC1pbmRpYS5zdmdcIiB9LFxuICAgIHsgaHJlZjogJ2h0dHBzOi8vZG9wdC5nb3YuaW4vJywgc3JjOiBcImFzc2V0cy9mb290ZXItcHJvdmlkZXIvbmV3L2RvcHQuc3ZnXCIgfSxcbiAgICB7IGhyZWY6ICdodHRwczovL2RhdGEuZ292LmluLycsIHNyYzogXCJhc3NldHMvZm9vdGVyLXByb3ZpZGVyL25ldy9kYXRhLWdvdi5zdmdcIiB9LFxuICAgIHsgaHJlZjogJ2h0dHBzOi8vd3d3Lm1laXR5Lmdvdi5pbi8nLCBzcmM6IFwiYXNzZXRzL2Zvb3Rlci1wcm92aWRlci9uZXcvTUVJVC5zdmdcIiB9LFxuICAgIHsgaHJlZjogJ2h0dHBzOi8vd3d3Lm15Z292LmluLycsIHNyYzogXCJhc3NldHMvZm9vdGVyLXByb3ZpZGVyL25ldy9teS1nb3Yuc3ZnXCIgfSxcbiAgICB7IGhyZWY6ICdodHRwczovL3d3dy5wbWluZGlhLmdvdi5pbi9lbi8nLCBzcmM6IFwiYXNzZXRzL2Zvb3Rlci1wcm92aWRlci9uZXcvcG0taW5kaWEuc3ZnXCIgfSxcbiAgICB7IGhyZWY6ICdodHRwczovL3d3dy5pbmRpYS5nb3YuaW4vJywgc3JjOiBcImFzc2V0cy9mb290ZXItcHJvdmlkZXIvbmV3L2luZGlhLWdvdi5zdmdcIiB9LFxuXG5dO1xuXG5leHBvcnQgY29uc3QgU1RBVF9BUlIgPSBbXG4gICAgeyBpY29uOiBcImFzc2V0cy9zdGF0X2ljb24vTmV0d29yayAyLnN2Z1wiLCBjb3VudDogXCIzMCsgTGFraHNcIiwgbmFtZTogXCJzdGF0cy5rYXJtYXlvZ2lzT25ib2FyZGVkXCIgfSxcbiAgICB7IGljb246IFwiYXNzZXRzL3N0YXRfaWNvbi9Qcm9ncmFtLnN2Z1wiLCBjb3VudDogXCI4NjhcIiwgbmFtZTogXCJzdGF0cy50b3RhbENvdXJzZXNcIiB9LFxuICAgIHsgaWNvbjogXCJhc3NldHMvc3RhdF9pY29uL05ldHdvcmsgNC5zdmdcIiwgY291bnQ6IFwiMyw4NDZcIiwgbmFtZTogXCJzdGF0cy50b3RhbENvbXBsZXRpdGlvbnNcIiB9LFxuICAgIHsgaWNvbjogXCJhc3NldHMvc3RhdF9pY29uL3Blb3BsZS5zdmdcIiwgY291bnQ6IFwiMSw1OTVcIiwgbmFtZTogXCJzdGF0cy5tb250aGx5QWN0aXZlVXNlcnNcIiB9LFxuICAgIHsgaWNvbjogXCJhc3NldHMvc3RhdF9pY29uL05ldHdvcmsgNS5zdmdcIiwgY291bnQ6IFwiMSw1OTVcIiwgbmFtZTogXCJzdGF0cy5jZXJ0aWZpY2F0ZXNJc3N1ZWRcIiB9LFxuXVxuXG5leHBvcnQgY29uc3QgU09DSUFMX0xJTktTID0gW1xuICAgIHsgYWN0aXZlOiB0cnVlLCBocmVmX3VybDogXCJodHRwczovL3R3aXR0ZXIuY29tL2lHT1RLYXJtYXlvZ2lcIiwgbmFtZTogXCJ0d2l0dGVyXCIsIHNyYzogXCJhc3NldHMvc29jaWFsX2ljb25zL3guc3ZnXCIgfSxcbiAgICB7IGFjdGl2ZTogdHJ1ZSwgaHJlZl91cmw6IFwiaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2NvbXBhbnkva2FybWF5b2dpLWJoYXJhdC9cIiwgbmFtZTogXCJsaW5rZWRpblwiLCBzcmM6IFwiYXNzZXRzL3NvY2lhbF9pY29ucy9pbi5zdmdcIiB9LFxuICAgIHsgYWN0aXZlOiB0cnVlLCBocmVmX3VybDogXCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9jaGFubmVsL1VDUE8yZmFUOFlFaTZRXzJJWTVrZjJEZ1wiLCBuYW1lOiBcInlvdXR1YmVcIiwgc3JjOiBcImFzc2V0cy9zb2NpYWxfaWNvbnMveXQuc3ZnXCIgfSxcbiAgICB7IGFjdGl2ZTogdHJ1ZSwgaHJlZl91cmw6IFwiaHR0cHM6Ly93d3cuaW5zdGFncmFtLmNvbS9rYXJtYXlvZ2liaGFyYXQvXCIsIG5hbWU6IFwiaW5zdGFncmFtXCIsIHNyYzogXCJhc3NldHMvc29jaWFsX2ljb25zL2luc3Quc3ZnXCIgfSxcbiAgICB7IGFjdGl2ZTogdHJ1ZSwgaHJlZl91cmw6IFwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3Byb2ZpbGUucGhwP2lkPTEwMDA4OTc4Mjg2Mzg5N1wiLCBuYW1lOiBcImZhY2Vib29rXCIsIHNyYzogXCJhc3NldHMvc29jaWFsX2ljb25zL2ZiLnN2Z1wiIH0sXG5dO1xuXG5leHBvcnQgY29uc3QgTEFOR1VBR0VTID0gW1xuICAgIHtcbiAgICAgICAgXCJ2YWx1ZVwiOiBcIuCmrOCmvuCmguCmsuCmvlwiLFxuICAgICAgICBcImtleVwiOiBcImJlXCJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgXCJ2YWx1ZVwiOiBcIkVuZ2xpc2hcIixcbiAgICAgICAgXCJrZXlcIjogXCJlblwiXG4gICAgfSxcbiAgICB7XG4gICAgICAgIFwidmFsdWVcIjogXCLgpLngpL/gpILgpKbgpYBcIixcbiAgICAgICAgXCJrZXlcIjogXCJoaVwiXG4gICAgfSxcbiAgICB7XG4gICAgICAgIFwidmFsdWVcIjogXCLgspXgsqjgs43gsqjgsqFcIixcbiAgICAgICAgXCJrZXlcIjogXCJrYVwiXG4gICAgfSxcbiAgICAvLyB7XG4gICAgLy8gICAgIFwidmFsdWVcIjogXCLgtK7gtLLgtK/gtL7gtLPgtIJcIixcbiAgICAvLyAgICAgXCJrZXlcIjogXCJtbFwiXG4gICAgLy8gfSxcbiAgICB7XG4gICAgICAgIFwidmFsdWVcIjogXCLgpK7gpLDgpL7gpKDgpYBcIixcbiAgICAgICAgXCJrZXlcIjogXCJtclwiXG4gICAgfSxcbiAgICB7XG4gICAgICAgIFwidmFsdWVcIjogXCLgrqTgrq7grr/grrTgr41cIixcbiAgICAgICAgXCJrZXlcIjogXCJ0YVwiXG4gICAgfSxcbiAgICAvLyB7XG4gICAgLy8gICAgIFwidmFsdWVcIjogXCLgsKTgsYbgsLLgsYHgsJfgsYFcIixcbiAgICAvLyAgICAgXCJrZXlcIjogXCJ0ZVwiXG4gICAgLy8gfSxcbiAgICAvLyB7XG4gICAgLy8gICAgIFwidmFsdWVcIjogXCLgpoXgprjgpq7gp4Dgpq/gprzgpr5cIixcbiAgICAvLyAgICAgXCJrZXlcIjogXCJhc1wiXG4gICAgLy8gfSxcbiAgICBcbiAgICAvLyB7XG4gICAgLy8gICAgIFwidmFsdWVcIjogXCLgqpfgq4HgqpzgqrDgqr7gqqTgq4BcIixcbiAgICAvLyAgICAgXCJrZXlcIjogXCJndVwiXG4gICAgLy8gfSxcbiAgICBcbiAgICAvLyB7XG4gICAgLy8gICAgIFwidmFsdWVcIjogXCLgrJPgrKHgrL/grIZcIixcbiAgICAvLyAgICAgXCJrZXlcIjogXCJvZFwiXG4gICAgLy8gfSxcbiAgICAvLyB7XG4gICAgLy8gICAgIFwidmFsdWVcIjogXCLgqKrgqbDgqJzgqL7gqKzgqYBcIixcbiAgICAvLyAgICAgXCJrZXlcIjogXCJwdVwiXG4gICAgLy8gfVxuXVxuXG5leHBvcnQgY29uc3QgT1JHQU5JU0FUSU9OX1BBUlRORVJTID0ge1xuICAgIGhlYWRlcjoge1xuICAgICAgICBoZWFkZXJUZXh0OiBgb3JnYW5pc2F0aW9uUGFydG5lcnMudGl0bGVgLFxuICAgICAgICB0eXBlOiBgb3JnYW5pc2F0aW9uc1BhcnRuZXJzYFxuICAgIH0sXG4gICAgZGF0YUxpc3Q6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICcxJyxcbiAgICAgICAgICAgIHRleHQ6ICdvcmdhbmlzYXRpb25QYXJ0bmVycy5zbGlkZVRleHRfMSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICcyJyxcbiAgICAgICAgICAgIHRleHQ6ICdvcmdhbmlzYXRpb25QYXJ0bmVycy5zbGlkZVRleHRfMidcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICczJyxcbiAgICAgICAgICAgIHRleHQ6ICdvcmdhbmlzYXRpb25QYXJ0bmVycy5zbGlkZVRleHRfMydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICc0JyxcbiAgICAgICAgICAgIHRleHQ6ICdvcmdhbmlzYXRpb25QYXJ0bmVycy5zbGlkZVRleHRfNCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICc1JyxcbiAgICAgICAgICAgIHRleHQ6ICdvcmdhbmlzYXRpb25QYXJ0bmVycy5zbGlkZVRleHRfNSdcbiAgICAgICAgfSxcbiAgICBdLFxufVxuXG5leHBvcnQgY29uc3QgRkFRX0NIQVRCT1QgPSB7XG4gICAgRmFxVGl0bGU6IGBGYXFUaXRsZWBcbn1cbmV4cG9ydCBjb25zdCBLQVJNQVlPR0lfQ09STkVSID0ge1xuICAgIHRpdGxlOiBga2FybWF5b2dpQ29ybmVyYFxufVxuXG5leHBvcnQgY29uc3QgQUJPVVRfS0FSTUFZT0dJID0ge1xuICAgIGhlYWRlcjoge1xuICAgICAgICBoZWFkZXJUZXh0OiAnYWJvdXRVc1BhZ2UudGl0bGUnXG4gICAgfSxcbiAgICBhYm91dDoge1xuICAgICAgICBpbWFnZToge1xuICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMvYWJvdXQtdXMtYmFubmVyLnBuZycsXG4gICAgICAgICAgICBpbWFnZUhlYWRlcjogJ2Fib3V0VXNQYWdlLnRlYW1LYXJtYXlvZ2lCaGFyYXQnXG4gICAgICAgIH0sXG4gICAgICAgIGFib3V0VXM6IFtcbiAgICAgICAgICAgICdhYm91dFVzUGFnZS5jb250ZXN0MScsXG5cbiAgICAgICAgICAgIGBhYm91dFVzUGFnZS5jb250ZXN0MmBcbiAgICAgICAgXSxcbiAgICAgICAga2FybWF5b2dpVmlzaW9uczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdmlzaW9uX2ljb24uc3ZnJyxcbiAgICAgICAgICAgICAgICBpY29uQ2xhc3M6ICd2aXNpb24taWNvbicsXG4gICAgICAgICAgICAgICAgaGVhZGVyOiAnYWJvdXRVc1BhZ2UudmlzaW9uJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2Fib3V0VXNQYWdlLnZpc2lvbkRlc2NyaXB0aW9uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL21pc3Npb25faWNvbi5zdmcnLFxuICAgICAgICAgICAgICAgIGljb25DbGFzczogJ21pc3Npb24taWNvbicsXG4gICAgICAgICAgICAgICAgaGVhZGVyOiAnYWJvdXRVc1BhZ2UubWlzc2lvbicsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdhYm91dFVzUGFnZS5taXNzaW9uRGVzY3JpcHRpb24nXG4gICAgICAgICAgICB9XG4gICAgICAgIF0sXG5cbiAgICB9LFxufVxuXG5leHBvcnQgY29uc3QgS0FSTUFZT0dJX0ZVTkNUSU9OUyA9IHtcbiAgICBoZWFkZXI6ICdrYXJtYXlvZ2lGdW5jdGlvbnMudGl0bGUnLFxuICAgIGZ1bmN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2Z1bmN0aW9uc19pY29ucy9kZXNpZ25fZnVuY3Rpb24uc3ZnJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAna2FybWF5b2dpRnVuY3Rpb25zLmRlc2lnbkZ1bmN0aW9uJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2Z1bmN0aW9uc19pY29ucy9nb3Zhc3Nlc3RzLnN2ZycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2thcm1heW9naUZ1bmN0aW9ucy5nb3Zlcm5tZW50QXNzZXN0cydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9mdW5jdGlvbnNfaWNvbnMvZmlsZS5zdmcnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdrYXJtYXlvZ2lGdW5jdGlvbnMuY3JlYXRlJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2Z1bmN0aW9uc19pY29ucy9tYW5hZ2VfYXNzZXNzbWVudC5zdmcnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdrYXJtYXlvZ2lGdW5jdGlvbnMubWFuYWdlQXNzZXNzbWVudCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9mdW5jdGlvbnNfaWNvbnMvdGVsZW1ldHJ5X2RhdGEuc3ZnJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAna2FybWF5b2dpRnVuY3Rpb25zLnRlbGVtZXRyeURhdGEnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvZnVuY3Rpb25zX2ljb25zL2hxLnN2ZycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2thcm1heW9naUZ1bmN0aW9ucy5ndWlkZWxpbmVzJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2Z1bmN0aW9uc19pY29ucy9tZWNoYW5pc20uc3ZnJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAna2FybWF5b2dpRnVuY3Rpb25zLm1lY2hhbmlzbSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9mdW5jdGlvbnNfaWNvbnMvcHJvY3VyZW1lbnQuc3ZnJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAna2FybWF5b2dpRnVuY3Rpb25zLnByb2N1cmVtZW50J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2Z1bmN0aW9uc19pY29ucy9pbmZvcm1hdGlvbi5zdmcnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdrYXJtYXlvZ2lGdW5jdGlvbnMuaW5mb3JtYXRpb24nXG4gICAgICAgIH0sXG4gICAgXVxufVxuXG5leHBvcnQgY29uc3QgS0FSTUFZT0dJX1RFQU0gPSB7XG4gICAgaGVhZGVyOiAna2FybWF5b2dpVGVhbS50aXRsZScsXG4gICAgY2F0ZWdvcmllczogW1xuICAgICAgICB7XG4gICAgICAgICAgICB0YWJOYW1lOiAna2FybWF5b2dpVGVhbS5ib2FyZE9mRGlyZWN0b3JUYWInLFxuICAgICAgICAgICAgdGFiSWQ6ICdkaXJlY3RvcicsXG4gICAgICAgICAgICB0ZWFtTWVtYmVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMuc3VicmFtYW5pYW5SYW1hZG9yYWknLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9kaXJlY3Rvckxpc3Qvc3ViaHJhbWFuaWFuLnBuZycsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMuc3VicmFtYW5pYW5SYW1hZG9yYWlSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJ2h0dHBzOi8veC5jb20vc19yYW1hZG9yYWk/cz0yMSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL3N1YnJhbWFuaWFuLXJhbWFkb3JhaS04ODQ3YTUyNjU/dXRtX3NvdXJjZT1zaGFyZSZ1dG1fY2FtcGFpZ249c2hhcmVfdmlhJnV0bV9jb250ZW50PXByb2ZpbGUmdXRtX21lZGl1bT1pb3NfYXBwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLnJhY2huYVNoYWgnLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9kaXJlY3Rvckxpc3QvcmFjaG5hU2hhaC5wbmcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLnJhY2huYVNoYWhSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLnNrcmlzaG5hbicsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2RpcmVjdG9yTGlzdC9zIGtyaXNobmFuLmpwZycsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMuc2tyaXNobmFuUm9sZXMnLFxuICAgICAgICAgICAgICAgICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICdodHRwczovL3guY29tL2FiaGlzaDE4P3M9MjEnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJ2h0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9pbi9hYmhpc2hla3NpbmdoaWFzP3V0bV9zb3VyY2U9c2hhcmUmdXRtX2NhbXBhaWduPXNoYXJlX3ZpYSZ1dG1fY29udGVudD1wcm9maWxlJnV0bV9tZWRpdW09aW9zX2FwcCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5nb3ZpbmRJeWVyJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMvZGlyZWN0b3JMaXN0L2dvdmluZC5wbmcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLmdvdmluZEl5ZXJSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2dvdmluZGl5ZXI/dXRtX3NvdXJjZT1zaGFyZSZ1dG1fY2FtcGFpZ249c2hhcmVfdmlhJnV0bV9jb250ZW50PXByb2ZpbGUmdXRtX21lZGl1bT1pb3NfYXBwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLm5pcm1hbGplZXRTaW5naEthbHNpJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMvZGlyZWN0b3JMaXN0L25pcm1hbGplZXQucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5uaXJtYWxqZWV0U2luZ2hLYWxzaVJvbGVzJyxcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnaHR0cHM6Ly94LmNvbS9uc2thbHNpP3M9MjEnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJ2h0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9pbi9kci1uaXJtYWxqZWV0LXNpbmdoLWthbHNpLWlhcy1yZXRkLTBiODQ1NjE/dXRtX3NvdXJjZT1zaGFyZSZ1dG1fY2FtcGFpZ249c2hhcmVfdmlhJnV0bV9jb250ZW50PXByb2ZpbGUmdXRtX21lZGl1bT1pb3NfYXBwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLnBhbmthakJhbnNhbCcsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2RpcmVjdG9yTGlzdC9wYW5rYWoucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5wYW5rYWpCYW5zYWxSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJ2h0dHBzOi8veC5jb20vcGFua2FqYmFuc2FscGI/cz0yMSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL3BicGFua2FqYmFuc2FsP3V0bV9zb3VyY2U9c2hhcmUmdXRtX2NhbXBhaWduPXNoYXJlX3ZpYSZ1dG1fY29udGVudD1wcm9maWxlJnV0bV9tZWRpdW09aW9zX2FwcCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5kZWJqYW5pR2hvc2gnLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9kaXJlY3Rvckxpc3QvZGViamFuaS5wbmcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLmRlYmphbmlHaG9zaFJvbGVzJyxcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnaHR0cHM6Ly94LmNvbS9kZWJqYW5pX2dob3NoXz9zPTIxJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICdodHRwczovL3d3dy5saW5rZWRpbi5jb20vaW4vZGViamFuaS1naG9zaC00ODI5OGIxP3V0bV9zb3VyY2U9c2hhcmUmdXRtX2NhbXBhaWduPXNoYXJlX3ZpYSZ1dG1fY29udGVudD1wcm9maWxlJnV0bV9tZWRpdW09aW9zX2FwcCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5sYWxpdGhhTGFrc2htaScsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2RpcmVjdG9yTGlzdC9DRU8tTWFtLnBuZycsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMubGFsaXRoYUxha3NobWlSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLmFzaGlzaFBhaScsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2RpcmVjdG9yTGlzdC9hc2hpc2gucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5hc2hpc2hQYWlSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2FzaGlzaC1wYWktMTA0OTlhMTIvP3V0bV9zb3VyY2U9c2hhcmUmdXRtX2NhbXBhaWduPXNoYXJlX3ZpYSZ1dG1fY29udGVudD1wcm9maWxlJnV0bV9tZWRpdW09aW9zX2FwcCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5oZW1hbmdKYW5pJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMvamFuaS5zdmcnLFxuICAgICAgICAgICAgICAgIC8vICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLmhlbWFuZ0phbmlSb2xlcycsXG4gICAgICAgICAgICAgICAgLy8gICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vICAgICBdXG4gICAgICAgICAgICAgICAgLy8gfSxcblxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMuYWxrZXNoS3VtYXJTaGFybWEnLFxuICAgICAgICAgICAgICAgIC8vICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9hbGtlc2guc3ZnJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5hbGtlc2hLdW1hclNoYXJtYVJvbGVzJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gICAgIF1cbiAgICAgICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMuc2FudHJ1cHRNaXNyYScsXG4gICAgICAgICAgICAgICAgLy8gICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL3NhbnRydXB0LnN2ZycsXG4gICAgICAgICAgICAgICAgLy8gICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMuc2FudHJ1cHRNaXNyYVJvbGVzJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gICAgIF1cbiAgICAgICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0YWJOYW1lOiAna2FybWF5b2dpVGVhbS5rYXJtYXlvZ2lUZWFtVGFiJyxcbiAgICAgICAgICAgIHRhYklkOiAnS2FybWF5b2dpJyxcbiAgICAgICAgICAgIHRlYW1NZW1iZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5sYWxpdGhhTGFrc2htaScsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2RpcmVjdG9yTGlzdC9DRU8tTWFtLnBuZycsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMubGFsaXRoYUxha3NobWlSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJ2h0dHBzOi8veC5jb20vYWJoaXNoMTg/cz0yMSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2FiaGlzaGVrc2luZ2hpYXM/dXRtX3NvdXJjZT1zaGFyZSZ1dG1fY2FtcGFpZ249c2hhcmVfdmlhJnV0bV9jb250ZW50PXByb2ZpbGUmdXRtX21lZGl1bT1pb3NfYXBwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMucmFrZXNoVmVybWEnLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL3Jha2VzaC5qcGcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLnJha2VzaFZlcm1hUm9sZXMnLFxuICAgICAgICAgICAgICAgICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5hc2hpc2hQYWlXaXRob3V0U3JpJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMvZGlyZWN0b3JMaXN0L2FzaGlzaC5wbmcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLmFzaGlzaFBhaVJvbGVzV2l0aG91dEthcm1heW9naScsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2FzaGlzaC1wYWktMTA0OTlhMTIvP3V0bV9zb3VyY2U9c2hhcmUmdXRtX2NhbXBhaWduPXNoYXJlX3ZpYSZ1dG1fY29udGVudD1wcm9maWxlJnV0bV9tZWRpdW09aW9zX2FwcCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5yYW5hUHJhdGFwU2luZ2gnLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL3JhbmFQcmF0YXBTaW5naC5qcGcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLnJhbmFQcmF0YXBTaW5naFJvbGVzJyxcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnaHR0cHM6Ly90d2l0dGVyLmNvbS9yYW5hcHJzaW5naCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL3JhbmFwcmF0YXBzaW5naDEvJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLm1vbm9qZWV0Q2hha3Jhdm9ydHknLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL21vbm9qZWV0LmpwZycsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMubW9ub2plZXRDaGFrcmF2b3J0eVJvbGVzJyxcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5oYXJsZWVuU2FjaGRldmEnLFxuICAgICAgICAgICAgICAgIC8vICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL2hhcmxlZW5TYWNoZGV2YS5qcGcnLFxuICAgICAgICAgICAgICAgIC8vICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLmhhcmxlZW5TYWNoZGV2YVJvbGVzJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICdodHRwczovL3d3dy5saW5rZWRpbi5jb20vaW4vYXNoaXNoLXBhaS0xMDQ5OWExMi8/dXRtX3NvdXJjZT1zaGFyZSZ1dG1fY2FtcGFpZ249c2hhcmVfdmlhJnV0bV9jb250ZW50PXByb2ZpbGUmdXRtX21lZGl1bT1pb3NfYXBwJ1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vICAgICBdXG4gICAgICAgICAgICAgICAgLy8gfSxcblxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMuc2FtdGFLdW1hcmlTaW1teScsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2thcm1heW9naVRlYW0vc2FtdGFLdW1hcmkuanBnJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5zYW10YUt1bWFyaVNpbW15Um9sZXMnLFxuICAgICAgICAgICAgICAgICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJ2h0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9pbi9jc3NhbXRha3NpbW15P3V0bV9zb3VyY2U9c2hhcmUmdXRtX2NhbXBhaWduPXNoYXJlX3ZpYSZ1dG1fY29udGVudD1wcm9maWxlJnV0bV9tZWRpdW09YW5kcm9pZF9hcHAnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMuaGVtYW50U2hhcm1hJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMva2FybWF5b2dpVGVhbS9oZW1hbnQuanBnJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5oZW1hbnRTaGFybWFSb2xlcycsXG4gICAgICAgICAgICAgICAgLy8gICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vICAgICBdXG4gICAgICAgICAgICAgICAgLy8gfSwgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLnNob2JoYW5hUmFuYScsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2thcm1heW9naVRlYW0vc2hvYmhhbmEuanBnJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5zaG9iaGFuYVJhbmFSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL3Nob2JoYW5hLXJhbmEtNTlhNDgwOTI/dXRtX3NvdXJjZT1zaGFyZSZ1dG1fY2FtcGFpZ249c2hhcmVfdmlhJnV0bV9jb250ZW50PXByb2ZpbGUmdXRtX21lZGl1bT1pb3NfYXBwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMucml0ZXNoS3VtYXInLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL3JpdGVzaC5qcGcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLnJpdGVzaEt1bWFyUm9sZXMnLFxuICAgICAgICAgICAgICAgICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5yYWh1bFJhbmphbicsXG4gICAgICAgICAgICAgICAgLy8gICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2thcm1heW9naVRlYW0vcmFodWxSYW5qYW4uanBnJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5yYWh1bFJhbmphblJvbGVzJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gICAgIF1cbiAgICAgICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMucmFqYXRQcmF0YXBTaW5naCcsXG4gICAgICAgICAgICAgICAgLy8gICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2thcm1heW9naVRlYW0vcmFqYXRQcmF0YXBTaW5naC5qcGcnLFxuICAgICAgICAgICAgICAgIC8vICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLnJhamF0UHJhdGFwU2luZ2hSb2xlcycsXG4gICAgICAgICAgICAgICAgLy8gICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vICAgICBdXG4gICAgICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLmthaWxhc2hDaGFuZHJhJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMva2FybWF5b2dpVGVhbS9rYWlsYXNoQ2hhbmRyYS5wbmcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLmthaWxhc2hDaGFuZHJhUm9sZXMnLFxuICAgICAgICAgICAgICAgICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5zb3VtaUJhbmVyamVlJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMva2FybWF5b2dpVGVhbS9zb3VtaUJhbmVyamVlLnBuZycsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMuc291bWlCYW5lcmplZVJvbGVzJyxcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMuZXNoYUthdGl5YXInLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL2VzaGEuanBnJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5lc2hhS2F0aXlhclJvbGVzJyxcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICdodHRwczovL3d3dy5saW5rZWRpbi5jb20vaW4vZXNoYS1rYXRpeWFyLTEzN2EzNTcxLydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5hbmtpdGFTb25kaGknLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL2Fua2l0YS5qcGcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLmFua2l0YVNvbmRoaVJvbGVzJyxcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICdodHRwczovL3d3dy5saW5rZWRpbi5jb20vaW4vYW5raXRhLXNvbmRoaS8nXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMuYWthbmtzaGFTcml2YXN0YXZhJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMva2FybWF5b2dpVGVhbS9ha2Fua3NoYVNyaXZhc3RhdmEuanBnJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5ha2Fua3NoYVNyaXZhc3RhdmFSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLmRpbmVzaFVwYXNlJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMva2FybWF5b2dpVGVhbS9pbWFnZS5wbmcnLCAvLyBpbWFnZSBtaXNzaW5nIGNoZWNrIHdpdGggZGhlZXJhalxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLmRpbmVzaFVwYXNlUm9sZXMnLFxuICAgICAgICAgICAgICAgICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5zeWVkTW9oZFV6YWlyJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMva2FybWF5b2dpVGVhbS9zeWVkTW9oZFV6YWlyLmpwZycsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMuc3llZE1vaGRVemFpclJvbGVzJyxcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICdodHRwczovL3d3dy5saW5rZWRpbi5jb20vaW4vc3llZC1tb2hkLXV6YWlyLWE4MmI5ODE0Ny8/b3JpZ2luYWxTdWJkb21haW49aW4nXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMuc2lkZGhpTWVobmRpcmF0dGEnLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL3NpZGRoaS5qcGcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLnNpZGRoaU1laG5kaXJhdHRhUm9sZXMnLFxuICAgICAgICAgICAgICAgICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICdodHRwczovL3guY29tL3NoZW11c2luZ3M/cz0yMSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL3NpZGRoaS1tZWhuZGlyYXR0YS01NzU0MDkyMTA/dXRtX3NvdXJjZT1zaGFyZSZ1dG1fY2FtcGFpZ249c2hhcmVfdmlhJnV0bV9jb250ZW50PXByb2ZpbGUmdXRtX21lZGl1bT1pb3NfYXBwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKiBQYXdhbiBLdW1hciBQYXRoYWsgbGVmdCB0aGUgdGVhbSAqL1xuXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy52YWliaGF2QWdhcndhbCcsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2thcm1heW9naVRlYW0vdmFpYmhhdi5qcGcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLnZhaWJoYXZBZ2Fyd2FsUm9sZXMnLFxuICAgICAgICAgICAgICAgICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJ2h0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9pbi9hc2hpc2gtcGFpLTEwNDk5YTEyLz91dG1fc291cmNlPXNoYXJlJnV0bV9jYW1wYWlnbj1zaGFyZV92aWEmdXRtX2NvbnRlbnQ9cHJvZmlsZSZ1dG1fbWVkaXVtPWlvc19hcHAnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMucmFqZXNoS3VtYXInLFxuICAgICAgICAgICAgICAgIC8vICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL3JhamVzaC5qcGcnLFxuICAgICAgICAgICAgICAgIC8vICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLnJhamVzaEt1bWFyUm9sZXMnLFxuICAgICAgICAgICAgICAgIC8vICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJ2h0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9pbi9hc2hpc2gtcGFpLTEwNDk5YTEyLz91dG1fc291cmNlPXNoYXJlJnV0bV9jYW1wYWlnbj1zaGFyZV92aWEmdXRtX2NvbnRlbnQ9cHJvZmlsZSZ1dG1fbWVkaXVtPWlvc19hcHAnXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gICAgIF1cbiAgICAgICAgICAgICAgICAvLyB9LFxuXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5zYWhpbEphaW4nLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL3NhaGlsSmFpbi5qcGcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLnNhaGlsSmFpblJvbGVzJyxcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICdodHRwczovL3d3dy5saW5rZWRpbi5jb20vaW4vYXNoaXNoLXBhaS0xMDQ5OWExMi8/dXRtX3NvdXJjZT1zaGFyZSZ1dG1fY2FtcGFpZ249c2hhcmVfdmlhJnV0bV9jb250ZW50PXByb2ZpbGUmdXRtX21lZGl1bT1pb3NfYXBwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLnNodWJoYW1HdXB0YScsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2thcm1heW9naVRlYW0vc2h1YmhhbS5qcGcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLnNodWJoYW1HdXB0YVJvbGVzJyxcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnaHR0cHM6Ly94LmNvbS9ndXB0YV9zaHViaGFtMDQvJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICdodHRwczovL3d3dy5saW5rZWRpbi5jb20vaW4vc2h1YmhhbWd1cHRhMDQvJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLnBhd2FuS3VtYXJQYXRoYWsnLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL1Bhd2FuLmpwZycsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMucGF3YW5LdW1hclBhdGhha1JvbGVzJyxcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMuYWJoaW1hbnl1U2hhcm1hJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMva2FybWF5b2dpVGVhbS9hYmhpbWFueXVTaGFybWEuanBnJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5hYmhpbWFueXVTaGFybWFSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLnZpbmF5YWtTZW4nLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL3ZpbmF5YWtTZW4uanBnJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy52aW5heWFrU2VuUm9sZXMnLFxuICAgICAgICAgICAgICAgICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICdodHRwczovL3R3aXR0ZXIuY29tL2l2YW5rYXluZXMnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJ2h0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9pbi92aW5heWFrLXNlbj91dG1fc291cmNlPXNoYXJlJnV0bV9jYW1wYWlnbj1zaGFyZV92aWEmdXRtX2NvbnRlbnQ9cHJvZmlsZSZ1dG1fbWVkaXVtPWlvc19hcHAnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMubmlkaGknLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL25pZGhpLmpwZycsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMubmlkaGlSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnd3d3LmxpbmtlZGluLmNvbS9pbi9uaWRoaS12YWlzaC0wMTM2MmExNjcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMubXVkZHVrcmlzaG5hJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMva2FybWF5b2dpVGVhbS9tdWRkdWtyaXNobmEuanBnJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5tdWRkdWtyaXNobmFSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJ2h0dHBzOi8vdHdpdHRlci5jb20vbXVkZHVrcmlzaG5hXz90PVFKTnVTVVhRRDd5Tjk3VXBRSkNiS3cmcz0wOSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL211ZGR1LWtyaXNobmEtMjY3YTM4OTg/dXRtX3NvdXJjZT1zaGFyZSZ1dG1fY2FtcGFpZ249c2hhcmVfdmlhJnV0bV9jb250ZW50PXByb2ZpbGUmdXRtX21lZGl1bT1hbmRyb2lkX2FwcCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5oZW5yeUFyb2tpYVJhaicsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2thcm1heW9naVRlYW0vaGVucnlBcm9raWEuanBnJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5oZW5yeUFyb2tpYVJhalJvbGVzJyxcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICdodHRwczovL3d3dy5saW5rZWRpbi5jb20vaW4vaGVucnktYXJva2lhLXJhai0wYjgwMjEyNDkvJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLnByaXlhbXZhZGFQYWxsYXZpTWlzaHJhJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMva2FybWF5b2dpVGVhbS9wcml5YW12YWRhUGFsbGF2aU1pc2hyYS5qcGcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLnByaXlhbXZhZGFQYWxsYXZpTWlzaHJhUm9sZXMnLFxuICAgICAgICAgICAgICAgICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJ2h0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9pbi9kci1wcml5YW12YWRhLW1pc2hyYS02MTgxOTYxYmI/dXRtX3NvdXJjZT1zaGFyZSZ1dG1fY2FtcGFpZ249c2hhcmVfdmlhJnV0bV9jb250ZW50PXByb2ZpbGUmdXRtX21lZGl1bT1pb3NfYXBwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgLy8gICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLmFtaXRTaW5naGFsJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMva2FybWF5b2dpVGVhbS9hbWl0U2luZ2hhbC5qcGcnLFxuICAgICAgICAgICAgICAgIC8vICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLmFtaXRTaW5naGFsUm9sZXMnLFxuICAgICAgICAgICAgICAgIC8vICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJ2h0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9pbi9hbWl0LXNpbmdoYWwtMTUwMDRiMTE0J1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vICAgICBdXG4gICAgICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLmFrc2hheVNoYXJtYScsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2thcm1heW9naVRlYW0vYWtzaGF5U2hhcm1hLmpwZycsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMuYWtzaGF5U2hhcm1hUm9sZXMnLFxuICAgICAgICAgICAgICAgICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJ2h0dHA6Ly93d3cubGlua2VkaW4uY29tL2luL2Frc2hheXNoYXJtYTEyJyAvLyBOT1NPTkFSXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMucmFrc2hhbmRhU2luZ2hUaGFrdXInLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL3Jha3NoYW5kYVNpbmdoLmpwZycsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMucmFrc2hhbmRhU2luZ2hUaGFrdXJSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJyBodHRwczovL3R3aXR0ZXIuY29tL1Jha3NoYW5kYVNpbmcyMCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL3Jha3NoYW5kYS1zaW5naC10aGFrdXItMDA3YTQ1MWE0P3Ryaz1jb250YWN0LWluZm8nXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMuc2hlZXRhbCcsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2thcm1heW9naVRlYW0vc2hlZXRhbC5wbmcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLnNoZWV0YWxSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLnRhcmFucGFsU2luZ2gnLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL3RhcmFucGFsU2luZ2gucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy50YXJhbnBhbFNpbmdoUm9sZXMnLFxuICAgICAgICAgICAgICAgICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5uaXRpa2FEb2dyYScsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2thcm1heW9naVRlYW0vbml0aWthRG9ncmEucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5uaXRpa2FEb2dyYVJvbGVzJyxcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMuc3VtYW4nLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL3N1bWFuLmpwZycsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMuc3VtYW5Sb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSwgXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy52aXNoYWxUb21lcicsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2thcm1heW9naVRlYW0vdmlzaGFsVG9tZXIuanBnJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy52aXNoYWxUb21lclJvbGVzJyxcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LCAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMudml2ZWtSYW5qYW5QYW5kZXknLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL2ltYWdlLnBuZycsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMudml2ZWtSYW5qYW5QYW5kZXlSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLmFqYXlTaW5naCcsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2thcm1heW9naVRlYW0vaW1hZ2UucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5hamF5U2luZ2hSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLnByaXlhbmthS3VtYXJpJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMva2FybWF5b2dpVGVhbS9pbWFnZS5wbmcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLnByaXlhbmthS3VtYXJpUm9sZXMnLFxuICAgICAgICAgICAgICAgICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5sYWROaW1lc2hrdW1hckJhbGF2YW50YmhhaScsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2thcm1heW9naVRlYW0vaW1hZ2UucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5sYWROaW1lc2hrdW1hckJhbGF2YW50YmhhaVJvbGVzJyxcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMuYXNoaXNoS3VtYXInLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL2FzaGlzaEt1bWFyLnBuZycsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMuYXNoaXNoS3VtYXJSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLnNoYW5pS3VtYXInLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL3NoYW5pS3VtYXIucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5zaGFuaUt1bWFyUm9sZXMnLFxuICAgICAgICAgICAgICAgICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5rYW1sZXNoS3VtYXJZYWRhdicsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2thcm1heW9naVRlYW0va2FtbGVzaEt1bWFyWWFkYXYucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5rYW1sZXNoS3VtYXJZYWRhdlJvbGVzJyxcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMuYW5iYWxhZ2FuQXJ1blJhamEnLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL2FuYmFsYWdhbkFydW5SYWphLnBuZycsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMuYW5iYWxhZ2FuQXJ1blJhamFSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLmFuamFsaUt1bWFyQmhhcmFkd2FqJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMva2FybWF5b2dpVGVhbS9hbmphbGlLdW1hckJoYXJhZHdhai5wbmcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLmFuamFsaUt1bWFyQmhhcmFkd2FqUm9sZXMnLFxuICAgICAgICAgICAgICAgICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5hc2hpc2hUaGFrcmFuJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMva2FybWF5b2dpVGVhbS9hc2hpc2hUaGFrcmFuLnBuZycsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMuYXNoaXNoVGhha3JhblJvbGVzJyxcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMucmFuamFuYVRyaXBhdGhpJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMva2FybWF5b2dpVGVhbS9yYW5qYW5hVHJpcGF0aGkucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5yYW5qYW5hVHJpcGF0aGlSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLnJlZW5hQmhhc2luJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMva2FybWF5b2dpVGVhbS9yZWVuYUJoYXNpbi5wbmcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLnJlZW5hQmhhc2luUm9sZXMnLFxuICAgICAgICAgICAgICAgICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5tZWVudVBhdGhhaycsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGluazogJ2Fzc2V0cy9hYm91dHVzL2thcm1heW9naVRlYW0vbWVlbnVQYXRoYWsucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5tZWVudVBhdGhha1JvbGVzJyxcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMuaGltYW5zaHUnLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL2ltYWdlLnBuZycsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMuaGltYW5zaHVSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLnJpc2hhYmhKYWluJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMva2FybWF5b2dpVGVhbS9pbWFnZS5wbmcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLnJpc2hhYmhKYWluUm9sZXMnLFxuICAgICAgICAgICAgICAgICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5zdW5pbEt1bWFyJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMva2FybWF5b2dpVGVhbS9zdW5pbEt1bWFyLnBuZycsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMuc3VuaWxLdW1hclJvbGVzJyxcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTWVkaWE6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL3R3aXRlci5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGluazogJ2Fzc2V0cy9hYm91dHVzL2xpbmtlZGluLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlcnMucmFuZGhpckt1bWFyU2luZ2gnLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL3JhbmRoaXJLdW1hclNpbmdoLnBuZycsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVyUm9sZXMucmFuZGhpckt1bWFyU2luZ2hSb2xlcycsXG4gICAgICAgICAgICAgICAgICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlck5hbWU6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJzLmFuamFsaVNpa2Fyd2FyJyxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMaW5rOiAnYXNzZXRzL2Fib3V0dXMva2FybWF5b2dpVGVhbS9hbmphbGlTaWthcndhci5wbmcnLFxuICAgICAgICAgICAgICAgICAgICByb2xlczogJ2thcm1heW9naVRlYW0udGVhbU1lbWJlclJvbGVzLmFuamFsaVNpa2Fyd2FyUm9sZXMnLFxuICAgICAgICAgICAgICAgICAgICBzb2NpYWxNZWRpYTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvdHdpdGVyLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkxpbms6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MaW5rOiAnYXNzZXRzL2Fib3V0dXMvbGlua2VkaW4uc3ZnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sICAgXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICBtZW1iZXJOYW1lOiAna2FybWF5b2dpVGVhbS50ZWFtTWVtYmVycy5zYW1wYWRhU2luZ2gnLFxuICAgICAgICAgICAgICAgIC8vICAgICBpbWFnZUxpbms6ICdhc3NldHMvYWJvdXR1cy9rYXJtYXlvZ2lUZWFtL3NhbXBhZGEuanBnJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgcm9sZXM6ICdrYXJtYXlvZ2lUZWFtLnRlYW1NZW1iZXJSb2xlcy5zYW1wYWRhU2luZ2hSb2xlcycsXG4gICAgICAgICAgICAgICAgLy8gICAgIHNvY2lhbE1lZGlhOiBbXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy90d2l0ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBuYXZpZ2F0aW9uTGluazogJydcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWNvbkxpbms6ICdhc3NldHMvYWJvdXR1cy9saW5rZWRpbi5zdmcnLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIG5hdmlnYXRpb25MaW5rOiAnJ1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vICAgICBdXG4gICAgICAgICAgICAgICAgLy8gfSxcblxuXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICBdXG59XG5cbmV4cG9ydCBjb25zdCBURU5ERVJTID0ge1xuICAgIGhlYWRlcjoge1xuICAgICAgICBoZWFkZXJUZXh0OiBgdGVuZGVyLnRpdGxlYCxcbiAgICAgICAgZG93bmxvYWRQZGY6IGB0ZW5kZXIuZG93bmxvYWRQZGZgXG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgTk9USUZJQ0FUSU9OUyA9IHtcbiAgICBoZWFkZXI6IHtcbiAgICAgICAgaGVhZGVyVGV4dDogYG5vdGlmaWNhdGlvbnMudGl0bGVgLFxuICAgICAgICBkb3dubG9hZFBkZjogYG5vdGlmaWNhdGlvbnMuZG93bmxvYWRQZGZgXG4gICAgfVxufVxuXG5cbmV4cG9ydCBjb25zdCBDQVJFRVIgPSB7XG4gICAgaGVhZGVyOiB7XG4gICAgICAgIGhlYWRlclRleHQ6IGBjYXJlZXIudGl0bGVgLFxuICAgICAgICBwMTogYGNhcmVlci5wYXJhVGV4dDFgLFxuICAgICAgICBwMjogYGNhcmVlci5wYXJhVGV4dDJgLFxuICAgICAgICBoZWFkZXJQb3NpdGlvbjogYGNhcmVlci5wb3NpdGlvbnNUZXh0YFxuICAgIH0sXG4gICAgZmllbGRUZXh0OiB7XG4gICAgICAgIGYxOiBgY2FyZWVyLmpvYlRpdGxldGV4dGAsXG4gICAgICAgIGYyOiBgY2FyZWVyLmRlcGFydG1lbnRUZXh0YCxcbiAgICAgICAgZjM6IGBjYXJlZXIucG9zaXRpb25UZXh0YCxcbiAgICAgICAgYnRuMTogYGNhcmVlci5yZXNldFRleHRgLFxuICAgICAgICBidG4yOiBgY2FyZWVyLnNlYXJjaFRleHRgLFxuICAgICAgICBkb3dubG9hZFBkZjogYGNhcmVlci5kb3dubG9hZFBkZmBcbiAgICB9LFxuICAgIHBsYWNlaG9sZGVyVGV4dDoge1xuICAgICAgICBwMTogYGNhcmVlci5zZWxlY3RKb2JUaXRsZWAsXG4gICAgICAgIHAyOiBgY2FyZWVyLnNlbGVjdERlcGFydG1lbnRgLFxuICAgICAgICBwMzogYGNhcmVlci5zZWxlY3RQb3NpdGlvbmBcbiAgICB9LFxuXG4gICAgZGF0YUxpc3Q6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgaW1hZ2U6IGBhc3NldHMvYWJvdXR1cy9hYm91dC1uZXcuSlBHYCxcbiAgICAgICAgfVxuICAgIF1cbn1cblxuXG5leHBvcnQgY29uc3QgQ09OVEFDVFVTID0ge1xuICAgIGhlYWRlcjoge1xuICAgICAgICBoZWFkZXJ0ZXh0MTogYGNvbnRhY3QudGl0bGVUZXh0MWAsXG4gICAgICAgIGhlYWRlclRleHQyOiBgY29udGFjdC50aXRsZXRleHQyYFxuICAgIH0sXG4gICAgZmllbGRUZXh0OiB7XG4gICAgICAgIGYxOiBgY29udGFjdC5maWVsZHRleHQxYCxcbiAgICAgICAgZjI6IGBjb250YWN0LmZpZWxkdGV4dDJgLFxuICAgICAgICBmMzogYGNvbnRhY3QuZmllbGR0ZXh0M2AsXG4gICAgICAgIGY0OiBgY29udGFjdC5maWVsZHRleHQ0YCxcbiAgICAgICAgZjU6IGBjb250YWN0LmZpZWxkdGV4dDVgLFxuICAgICAgICBmNjogYGNvbnRhY3QuZmllbGR0ZXh0NmAsXG4gICAgICAgIGJ0bjogYGNvbnRhY3QuZmllbGR0ZXh0N2BcbiAgICB9LFxuICAgIGNvbnRhY3Q6IHtcbiAgICAgICAgaDE6IGBjb250YWN0LmhlYWR0ZXh0YCxcbiAgICAgICAgYWRkcmVzczogYGNvbnRhY3QuYWRkcmVzc1RleHRgLFxuICAgICAgICBtYWlsOiBgY29udGFjdC5tYWlsYCxcbiAgICAgICAgbnVtYmVyOiBgY29udGFjdC5udW10ZXh0YCxcbiAgICAgICAgbWFpbHRleHQ6IGBjb250YWN0Lm1haWx0ZXh0YCxcbiAgICAgICAgbnVtYmVydGV4dDogYGNvbnRhY3QubnVtYmVydGV4dGAsXG4gICAgICAgIGR1cmF0aW9uOiBgY29udGFjdC5kdXJhdGlvbmAsXG4gICAgICAgIHNsb3Q6IGBjb250YWN0LnNsb3RgLFxuICAgICAgICBhY3Rpb246IGBjb250YWN0LmFjdGlvbmBcbiAgICB9LFxuICAgIHBsYWNlaG9sZGVyOiB7XG4gICAgICAgIHBsYWNlaG9sZGVyVGV4dDE6IGBjb250YWN0LnBsYWNlaG9sZGVyVGV4dDFgLFxuICAgICAgICBwbGFjZWhvbGRlclRleHQyOiBgY29udGFjdC5wbGFjZWhvbGRlclRleHQyYCxcbiAgICAgICAgcGxhY2Vob2xkZXJUZXh0MzogYGNvbnRhY3QucGxhY2Vob2xkZXJUZXh0M2AsXG4gICAgICAgIHBsYWNlaG9sZGVyVGV4dDQ6IGBjb250YWN0LnBsYWNlaG9sZGVyVGV4dDRgLFxuICAgICAgICBwbGFjZWhvbGRlclRleHQ1OiBgY29udGFjdC5wbGFjZWhvbGRlclRleHQ1YFxuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBURU5ERVJTX0tBUk1BWU9HSSA9IHtcbiAgICBoZWFkZXI6IHtcbiAgICAgICAgaGVhZGVyVGV4dDogJ3RlbmRlcnMudGl0bGUnXG4gICAgfSxcbn0iXX0=