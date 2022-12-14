export interface ITypeMapper<Source, Dest> {
  map(subject: Source): Dest;
  invertMap(subject: Dest): Source;
}
