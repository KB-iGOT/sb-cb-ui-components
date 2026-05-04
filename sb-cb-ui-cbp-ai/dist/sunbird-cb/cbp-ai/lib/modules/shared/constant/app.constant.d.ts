export declare const HEADER_DATA: {
    welcome: {
        welcomeText: string;
        imageUrl: string;
    };
    karmayogiBtn: {
        text: string;
        link: string;
        display: boolean;
    };
    donloadBtn: {
        text: string;
        link: string;
        display: boolean;
    };
    btns: {
        text: string;
        link: string;
        type: string;
        language: string;
    }[];
    navHeader: {
        karmayogiBharath: {
            imgSrc: string;
            link: string;
        };
        navButtons: {
            text: string;
            link: string;
            fragment: string;
        }[];
        loginBtn: {
            text: string;
            link: string;
        };
        registerBtn: {
            text: string;
            link: string;
        };
        contactLink: {
            text: string;
            link: string;
            fragment: string;
        };
    };
};
export declare const DASHBOARD_ANALYTICS_LIST: {
    dashboaredHeader: string;
    analyticsList: {
        imgSrc: string;
        count: string;
        description: string;
        alt: string;
        id: string;
    }[];
}[];
export declare const FEATURES_COURSES: {
    header: {
        headerText: string;
        type: string;
        showAll: string;
    };
    dataList: any[];
};
export declare const TESTIMONIALS: {
    header: {
        headerText: string;
        type: string;
    };
    dataList: {
        posterImage: string;
        name: string;
        description: string;
        desig: string;
    }[];
};
export declare const NEWSROOM_COURSES: {
    header: {
        headerText: string;
        type: string;
    };
    dataList: any[];
    localDataList: {
        posterImage: string;
        name: string;
        downloadLink: string;
        button: string;
    }[];
};
export declare const TOP_PROVIDERS: {
    header: {
        headerText: string;
        type: string;
    };
    topProvidersList: {
        posterImage: string;
        name: string;
        clientUrl: string;
    }[];
};
export declare const ABOUT_US: {
    header: {
        headerText: string;
        p1: string;
        p2: string;
        p3: string;
        type: string;
    };
    dataList: {
        image: string;
    }[];
};
export declare const VIDEO_CONF: {
    title: string;
    thumbnail: string;
    text: string;
    date: string;
    time: string;
    button: string;
    joinLink: string;
    technicalSupport: string;
    plsContact: string;
};
export declare const PHOTO_GALLARY: {
    header: {
        headerText: string;
        type: string;
    };
    galleryList: ({
        name: string;
        src: string;
        cloudStorageKey?: undefined;
    } | {
        name: string;
        cloudStorageKey: string;
        src?: undefined;
    })[];
};
export declare const IGON_VISION_DETAILS: {
    vision: {
        imgUrl: string;
        alt: string;
    };
    videos: {
        poster: string;
        videoLink: string;
        line1: string;
        line2: string;
        line3: string;
    }[];
};
export declare const CONFERENCE_DATA: {
    title: string;
    description: string;
    workdays: string;
    timings: string;
    joinNow: string;
};
export declare const REGISTER_DETAILS: {
    lineOne: string;
    lineTwo: string;
    lineThree: string;
    registerBtn: {
        text: string;
        link: string;
    };
};
export declare const SOLUTIONS_SPACE: {
    solutionSpaceHeader: {
        lineOne: string;
        lineTwo: string;
    };
    solutionSpacesList: {
        name: string;
        description: string;
        imgSrc: string;
    }[];
};
export declare const QUICK_WALKTHROUGH_DETAILS: {
    videoLink: string;
    lineOne: string;
    lineTwo: string;
    lineThree: string;
    lineFour: string;
    lineFive: string;
};
export declare const MOBILE_APP_DOWNLOADS_DETAILS: {
    download: string;
    iGOT: string;
    karmayogi: string;
    mobile: string;
    app: string;
    description: string;
    scanners: {
        link: string;
        imgSrc: string;
        scannerSrc: string;
        text: string;
    }[];
    mockupImgSrc: string;
};
export declare const MOBILE_VIEW_APP_DOWNLOADS_DETAILS: {
    googleStore: {
        imgSrc: string;
        link: string;
    };
    appleStore: {
        imgSrc: string;
        link: string;
    };
    lineOne: string;
    lineTwo: string;
};
export declare const NAV_FOOTER_DETAILS: {
    navLinks: (({
        href: string;
        target: string;
        router: string;
        name: string;
        application?: undefined;
    } | {
        href: string;
        target: string;
        name: string;
        application: string;
        router?: undefined;
    })[] | {
        href: string;
        target: string;
        name: string;
    }[])[];
    followUs: string;
    copyRights: string;
    copyRightMobile: string;
};
export declare const NAV_FOOTER_DETAILS_MOBILE: {
    support: ({
        href: string;
        target: string;
        name: string;
        application: string;
        router?: undefined;
    } | {
        href: string;
        target: string;
        router: string;
        name: string;
        application?: undefined;
    })[];
    releated: ({
        href: string;
        target: string;
        router: string;
        name: string;
        application?: undefined;
    } | {
        href: string;
        target: string;
        name: string;
        application: string;
        router?: undefined;
    } | {
        href: string;
        target: string;
        name: string;
        router?: undefined;
        application?: undefined;
    })[];
    followUs: string;
    copyRights: string;
    copyRightMobile: string;
};
export declare const FOOTER_DETAILS: {
    copyRights: string;
};
export declare const HOW_TO_CARD_LIST: {
    header: {
        headerText: string;
        type: string;
    };
    dataList: {
        title: string;
        link: string;
        icon: string;
    }[];
};
export declare const INFOCUS_CARD: {
    videoCategory: string;
    header: {
        headerText: string;
        type: string;
    };
    dataList: {}[];
}[];
export declare const WHAT_IS_CARD: {
    header: {
        headerText: string;
        type: string;
    };
    dataList: {
        id: string;
        imgSrc: string;
        name: string;
        link: string;
    }[];
};
export declare const FOOTER_PROVIDER: {
    href: string;
    src: string;
}[];
export declare const STAT_ARR: {
    icon: string;
    count: string;
    name: string;
}[];
export declare const SOCIAL_LINKS: {
    active: boolean;
    href_url: string;
    name: string;
    src: string;
}[];
export declare const LANGUAGES: {
    value: string;
    key: string;
}[];
export declare const ORGANISATION_PARTNERS: {
    header: {
        headerText: string;
        type: string;
    };
    dataList: {
        id: string;
        text: string;
    }[];
};
export declare const FAQ_CHATBOT: {
    FaqTitle: string;
};
export declare const KARMAYOGI_CORNER: {
    title: string;
};
export declare const ABOUT_KARMAYOGI: {
    header: {
        headerText: string;
    };
    about: {
        image: {
            imageLink: string;
            imageHeader: string;
        };
        aboutUs: string[];
        karmayogiVisions: {
            iconLink: string;
            iconClass: string;
            header: string;
            description: string;
        }[];
    };
};
export declare const KARMAYOGI_FUNCTIONS: {
    header: string;
    functions: {
        iconLink: string;
        description: string;
    }[];
};
export declare const KARMAYOGI_TEAM: {
    header: string;
    categories: {
        tabName: string;
        tabId: string;
        teamMembers: {
            memberName: string;
            imageLink: string;
            roles: string;
            socialMedia: {
                iconLink: string;
                navigationLink: string;
            }[];
        }[];
    }[];
};
export declare const TENDERS: {
    header: {
        headerText: string;
        downloadPdf: string;
    };
};
export declare const NOTIFICATIONS: {
    header: {
        headerText: string;
        downloadPdf: string;
    };
};
export declare const CAREER: {
    header: {
        headerText: string;
        p1: string;
        p2: string;
        headerPosition: string;
    };
    fieldText: {
        f1: string;
        f2: string;
        f3: string;
        btn1: string;
        btn2: string;
        downloadPdf: string;
    };
    placeholderText: {
        p1: string;
        p2: string;
        p3: string;
    };
    dataList: {
        image: string;
    }[];
};
export declare const CONTACTUS: {
    header: {
        headertext1: string;
        headerText2: string;
    };
    fieldText: {
        f1: string;
        f2: string;
        f3: string;
        f4: string;
        f5: string;
        f6: string;
        btn: string;
    };
    contact: {
        h1: string;
        address: string;
        mail: string;
        number: string;
        mailtext: string;
        numbertext: string;
        duration: string;
        slot: string;
        action: string;
    };
    placeholder: {
        placeholderText1: string;
        placeholderText2: string;
        placeholderText3: string;
        placeholderText4: string;
        placeholderText5: string;
    };
};
export declare const TENDERS_KARMAYOGI: {
    header: {
        headerText: string;
    };
};
//# sourceMappingURL=app.constant.d.ts.map