import React from "react";
import { SvgXml } from "react-native-svg";
export default function SvgComponent(){
  const svgMarkup = `<svg width="40px" height="40px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M14,2 C14.2652165,2 14.5195704,2.10535684 14.7071068,2.29289322 L19.7071068,7.29289322 C19.8946432,7.4804296 20,7.73478351 20,8 L20,9 C20,9.55228475 19.5522847,10 19,10 L13,10 C12.4871642,10 12.0644928,9.61395981 12.0067277,9.11662113 L12,9 L11.999,4 L7,4 C6.44771525,4 6,4.44771525 6,5 L6,19 C6,19.5522847 6.44771525,20 7,20 L9,20 C9.55228475,20 10,20.4477153 10,21 C10,21.5522847 9.55228475,22 9,22 L7,22 C5.34314575,22 4,20.6568542 4,19 L4,5 C4,3.34314575 5.34314575,2 7,2 L14,2 Z M17,12 C17.5522847,12 18,12.4477153 18,13 L18,16 L21,16 C21.5522847,16 22,16.4477153 22,17 C22,17.5522847 21.5522847,18 21,18 L18,18 L18,21 C18,21.5522847 17.5522847,22 17,22 C16.4477153,22 16,21.5522847 16,21 L16,18 L13,18 C12.4477153,18 12,17.5522847 12,17 C12,16.4477153 12.4477153,16 13,16 L16,16 L16,13 C16,12.4477153 16.4477153,12 17,12 Z M13.999,4.414 L14,8 L17.586,8 L13.999,4.414 Z"/>
</svg>
`;
  const SvgImage = () => <SvgXml xml={svgMarkup} width="50px" fill="#6495ed" />;

  return <SvgImage />;
}