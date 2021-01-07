import { BaseModel } from './BaseModel';

export class Source extends BaseModel {
  public image: string;
  public sourceType: string; // source_type
  public newsCategory: string; // ref
  public newsAgency: string; // ref
  public link: string; // string
  public name: string;
  public country: string;
  public city: string;
  public setTimeout: number;
  public isUsable: boolean;
  public selectorUpdate: {
    find: string,
    paginate: string,
    pageLimit: number,
    setLink: string,
    addLink: string,
    preAddLink: string
  };
  public selectorData: {
    find: string,
    preAddLinkImg: string,
    setData: {
      title: string,
      content: string,
      img: string,
      tags: string,
      date: string,
      journalistName: string,
      journalistImage: string
    },
    configDate: {
      isConvert: boolean,
      format: string,
      locale: string
    }
  };
}
