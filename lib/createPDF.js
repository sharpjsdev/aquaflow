import RNHTMLtoPDF from "react-native-html-to-pdf";
import { generateFileHTML } from "./generateFileHTML";

export const createPDF = async values => {
  console.log(values);
  const html = generateFileHTML(values);
  const options = {
    html,
    fileName: "test",
    directory: "Documents"
  };
  return await RNHTMLtoPDF.convert(options);
};
