import { database } from "../database.js";
import { jsPDF } from "jspdf";
import moment from "moment";

const sprintPhases = [
  'Kickoff',
  'Follow-up',
  'Delivery'
];

const generatePDF = async (myObject, projectName, sprintNumber, sprintPhase, users) => {
  const documentName = 'test.pdf';
  const doc = new jsPDF();
  const month = moment().format('MM/YYYY');
  let categoryIndex = 0;
  let cardIndex = 0;

  // print Project Name, sprintNumber, sprintPhase, month at the center of the page in bold and bigger font
  doc.setFontSize(30);
  doc.text('PLD', 105, 80, { align: 'center' });
  doc.setFontSize(40);
  doc.setFont('helvetica', 'bold');
  doc.text(projectName, 105, 100, { align: 'center' });
  doc.setFontSize(35);
  doc.setFont('helvetica', 'normal');
  doc.text(`Sprint ${sprintNumber} - ${sprintPhase}`, 105, 120, { align: 'center' });
  doc.text(month, 105, 140, { align: 'center' });

  if (myObject.length === 0) { doc.save(documentName); return { error: false, message: 'PDF generated' } }

  for (const category of myObject) {
    if (category.cards.length === 0) continue;
    categoryIndex++;
    doc.addPage();
    doc.setFontSize(35);
    doc.setFont('helvetica', 'bold');
    doc.text(category.category, 105, 120, { align: 'center' });
    cardIndex = 0;
    for (const card of category.cards) {
      console.log('card', card);
      doc.addPage();
      cardIndex++;
      // display card category in bold
      doc.setFontSize(30);
      doc.setFont('helvetica', 'bold');
      doc.text(card.category_name, 105, 40, { align: 'center' });

      doc.setFontSize(20);
      doc.setFont('helvetica', 'normal');
      doc.text(`${categoryIndex}.${cardIndex} ${card.card_name}`, 20, 60, { align: 'left' });
      doc.text(`As a: ${card.card_as_a}`, 20, 80, { align: 'left' });
      doc.text(`I want: ${card.card_i_want_to}`, 20, 100, { align: 'left' });
      doc.text(`Description:\n ${card.card_description}`, 20, 120, { align: 'left', maxWidth: 180 });
      doc.text(`Definition of Done:\n ${card.card_definition_of_done}`, 20, 160, { align: 'left', maxWidth: 180 });
      doc.text(`Estimated time: ${card.card_estimated_time}`, 20, 230, { align: 'left' });
    }
  }

  doc.save(documentName);
  return { error: false, message: "PDF generated" };
}

export const exportPDF = async (projectName, sprintNumber, sprintPhase) => {
  const obj = [];

  if (sprintPhases.includes(sprintPhase) === false) {
    return { error: true, message: "Sprint phase not valid" };
  }

  const [users, fields1] = await database.execute(
    "SELECT uuid, username FROM users"
  );
  console.log('users', users);
  const [categories, fields] = await database.execute(
    "SELECT * FROM categories"
  );
  console.log('categories == ', categories);
  for (const category of categories) {
    const [cards, fields] = await database.execute(
      "SELECT * FROM cards WHERE category_name = ?",
      [category.category_name]
    );
    obj.push({ category: category.category_name, cards: cards });
  }
  console.log('obj: ',obj);

  return generatePDF(obj, projectName, sprintNumber, sprintPhase, users);
}