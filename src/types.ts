export interface Select {
    value: string | boolean,
    title: string
}

export interface Tag { 
    type: 'image' | 'string',
    value: string
}

export type Status = 'done' | 'in progress' | 'not started';

export type Priority = 'high' | 'medium' | 'low';

export interface Subparagraph {
    name: string,
    description: string,
    done: boolean,
    editing?: {
        name: false,
        description: false
    }
}

export interface Paragraph {
    name: string,
    description: string,
    subparagraphs: Subparagraph[],
    done: boolean,
    show?: boolean,
    editing?: {
        name: false,
        description: false
    }
}

export interface Task {
    title: string,
    status: Status,
    priority: Priority,
    tags: string[],
    in_grade: boolean,
    description: string,
    paragraphs: Paragraph[]
}

export interface Grade {
    name: string,
    persentage: number | string,
}