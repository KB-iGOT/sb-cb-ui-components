export namespace NsDiscussionV2 {
    export interface INewCommentConfig {
        show: boolean,
        showTopInfo: boolean,
        commentTreeData: {
            isFirstComment: boolean,
            commentTreeId: string,
            hierarchyPath: string[],
            entityType: string,
            entityId: string,
            workflow: string
        }
        topInfo: {
            icon: string,
            text: string
        },
        avatarPhoto: {
            show: boolean,
            size: string,
            photoUrl: string,
            name: string,
            color: string
        },
        commentBox: {
            placeholder: string
        },
        postBtn: {
            text: string
        },
        styles: any,

    }

    export interface ICommentCardActionsObj {
        show: boolean,
        showCount: boolean,
        icon: string,
    }

    export interface ICommentCardActions {
        like?: ICommentCardActionsObj,
        comments?: ICommentCardActionsObj,
        avatarPhoto?: {
            show: boolean,
            size: string,
            photoUrl: string,
            name: string,
            color: string
        },
    }

    export interface ICommentCardConfig {
        cardType: string,
        showActions: boolean,
        reportIcon?: {
            show: boolean,
            icon: string,
            successMsg: string,
            errorMsg: string,
            showToolTip: boolean,
            toolTipText: string
        },
        actions: ICommentCardActions,
        repliesSection: {
            show: boolean,
            newCommentReply?: INewCommentConfig,
            replyCardConfig?: ICommentCardConfig
        },
        noCommentsSection?: {
            text: string
        },
        newCommentReply?: INewCommentConfig
    }

    export interface ICommentWidgetData {
        newCommentSection: INewCommentConfig,
        commentsList: ICommentCardConfig,
        enrolledContent?: boolean
    }


    // Discussion v2 model 
    export interface INewPostConfig {
        show: boolean,
        type: string,
        openAsDialogue?: boolean,
        showTopInfo: boolean,
        topInfo: {
            icon: string,
            text: string
        },
        avatarPhoto: {
            show: boolean,
            size: string,
            photoUrl: string,
            name: string,
            color: string
        },
        commentBox: {
            openDialogue?: boolean
            placeholder: string
        },
        postBtn: {
            show?: boolean
            text: string,
            icon: string
        },
        styles: any,
    }

    export interface IPostCardConfig {
        cardType: string,
        type:string,
        showActions: boolean,
        sliderData?: any,
        reportIcon?: {
            show: boolean,
            icon: string,
            successMsg: string,
            errorMsg: string,
            showToolTip: boolean,
            toolTipText: string
        },
        actions: IPostCardActions,
        repliesSection: {
            show: boolean,
            indented?: boolean,
            newPostReply?: INewPostConfig,
            replyCardConfig?: IPostCardConfig
        },
        noPostsSection?: {
            text: string
        },
        newPostReply?: INewPostConfig
    }

    export interface IPostCardActionsObj {
        show: boolean,
        showCount: boolean,
        icon: string,
    }

    export interface IPostCardActions {
        like?: IPostCardActionsObj,
        comments?: IPostCardActionsObj,
        avatarPhoto?: {
            show: boolean,
            size: string,
            photoUrl: string,
            name: string,
            color: string
        },
    }

    export interface IDiscussV2WidgetData {
        newPostSection: INewPostConfig,
        postsList: IPostCardConfig,
    }

    export enum EPostType {
        QUESTION = 'question',
        ANSWER_POST = 'answerPost',
    }
}
