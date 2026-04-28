import {BaseEntity} from '../../../shared/domain/model/base-entity';

export class Category implements BaseEntity {
  private _id: number;
  private _name: string;

  constructor(props: {id: number, name: string}) {
    this._id = props.id;
    this._name = props.name;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }


}
