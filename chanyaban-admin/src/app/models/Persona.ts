/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { BaseModel } from './BaseModel';

export class Persona extends BaseModel {
  public name: String;
  public details: String;
  public personaType: String;
  public keywords: String[];
  public createdDate: Date;
  public modifiedDate: Date;
}