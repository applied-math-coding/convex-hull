export class Point{
    id?: number;
    input: string;
    output: string;
    convexHullId?: number;
    
    constructor(input: string, output: string){
        this.input = input;
        this.output = output;
    }
}