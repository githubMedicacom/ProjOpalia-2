
//User
import ListUser from "./Pages/Settings/User/ListUser";
import AjouterUser from "./Pages/Settings/User/AjouterUser";

//Role
import ListRole from "./Pages/Settings/Role/ListRole";
import AjouterRole from "./Pages/Settings/Role/AjouterRole";

//Settings
import Settings from "./Pages/Settings";

//Produit
import ListProduit from "./Pages/Settings/Produit/ListProduit";
import AjouterProduit from "./Pages/Settings/Produit/AjouterProduit";
import ListProduitFour from "./Pages/Settings/Produit/ListProduitFour";

//LigneIms
import AjouterLigneIms from "./Pages/Settings/LigneIms/AjouterLigneIms";
import ListLigneIms from "./Pages/Settings/LigneIms/ListLigneIms";

//MarcheIms
import ListMarcheIms from "./Pages/Settings/MarcheIms/ListMarcheIms";
import AjouterMarcheIms from "./Pages/Settings/MarcheIms/AjouterMarcheIms";

//Fournisseur
import AjouterFournisseur from "./Pages/Settings/Fournisseur/AjouterFournisseur";
import ListFournisseur from "./Pages/Settings/Fournisseur/ListFournisseur";

//Ims
import AjouterIms from "./Pages/Settings/Ims/AjouterIms";
import ListIms from "./Pages/Settings/Ims/ListIms";
import ImportIms from "./Pages/Settings/Ims/ImportIms";

//Pharmacie
import AjouterPharmacie from "./Pages/Settings/Pharmacie/AjouterPharmacie";
import ListPharmacie from "./Pages/Settings/Pharmacie/ListPharmacie";

//pack
import AjouterPack from "./Pages/Settings/Pack/AjouterPack";
import ListPack from "./Pages/Settings/Pack/ListPack";

import NotFound from "./Pages/NotFound";
import Profile from "./Pages/Profile";
import TransformerBL from "./Pages/Delegue/TransformerBL";
import ListeProduits from "./Pages/ListeProduits";
import ValidationBl from "./Pages/ValidationBl";
import VisualisationBl from "./Pages/VisualisationBl";
import TelechargerFichier from "./Pages/TelechargerFichier";
import ComparaisonIms from "./Pages/Admin/ComparaisonIms";

//DashBoard
import Overview from "./Pages/Admin/DashBoard/Overview";
import BlIms from "./Pages/Admin/DashBoard/BlIms";
import SuperDashBoard from "./Pages/Admin/DashBoard/SuperDashBoard";
import PackDashBoard from "./Pages/Admin/DashBoard/PackDashBoard";
import DelegueDashboard from "./Pages/Admin/DashBoard/DelegueDashboard";

//Secteur
import AjouterSecteur from "./Pages/Settings/Secteur/AjouterSecteur";
import ListSecteur from "./Pages/Settings/Secteur/ListSecteur";

//Segment
import AjouterSegment from "./Pages/Settings/Segment/AjouterSegment";
import ListSegment from "./Pages/Settings/Segment/ListSegment";
import ListSegmentPharma from "./Pages/Settings/Segment/ListSegmentPharma";

//ActionCommercial
import ActionDashBoard from "./Pages/SuperViseur/ActionCommercial/ActionDashBoard";
import AjouterAction from "./Pages/SuperViseur/ActionCommercial/AjouterAction";
import ListAction from "./Pages/SuperViseur/ActionCommercial/ListAction";
import ListTodo from "./Pages/SuperViseur/ActionCommercial/TodoList/ListTodo";
import ListAssociation from "./Pages/SuperViseur/ActionCommercial/ListAssociation";
import ListVisualisation from "./Pages/SuperViseur/ActionCommercial/Visualisation/ListVisualisation";
import Messagerie from "./Pages/SuperViseur/ActionCommercial/Messagerie/Messagerie";

//IAMarketings
import Highlight from "./Pages/Admin/IAMarketings/Highlight";
import Mapping from "./Pages/Admin/IAMarketings/Mapping";
import Segments from "./Pages/Admin/IAMarketings/Segments";
import Clustring from "./Pages/Admin/IAMarketings/Clustring";
import Transition from "./Pages/Admin/IAMarketings/Transition";



// Regions
import ListRegions from "./Pages/Settings/Region/ListRegion";
import AjouterRegion from "./Pages/Settings/Region/AjouterRegion";

// Poles
import AjouterPole from "./Pages/Settings/Pole/AjouterPole";
import ListPoles from "./Pages/Settings/Pole/ListPole";

// Veille
import AjouterVeille from "./Pages/DelegueMedical/Veille/AjouterVeille";

//prop commande 
// import PropositionCommmande from "./Pages/Delegue/PropositionCommande";
 import PropositionCommmandeMed from "./Pages/DelegueMedical/PropositionCommande";

var routes = [

 

  {
    path: "/listProduit",
    name: "Tableau des BL",
    icon: "fas fa-sort-amount-down",
    component: ListeProduits,
    componentStr:"ListeProduits",
    role: [0,1,4,5],
    element: <ListeProduits />,
  },
  {
    path: "/dashboard",
    name: "Tableau de bord",
    icon: "nc-icon nc-chart-pie-35",
    component: SuperDashBoard,
    componentStr:"SuperDashBoard",
    role: [1],
    element: <SuperDashBoard />,
  },
  {
    path: "/dashboard",
    name: "Tableau de bord",
    icon: "nc-icon nc-chart-pie-35",
    component: DelegueDashboard,
    componentStr: "DelegueDashboard",
    role: [2],
    element: <DelegueDashboard />,
  },
  {
    collapse: true,
    path: "/tableauDebord",
    name: "Bl extractions",
    state: "extractions",
    icon: "far fa-copy",
    role: [0,1,2,3],
    views: [
      {
        path: "/TransformerBL",
        name: "Transformer BL",
        icon: "nc-icon nc-single-copy-04",
        component: TransformerBL,
        componentStr: "TransformerBL",
        role: [2,3],
        element: <TransformerBL />,
      },
      {
        path: "/ValidationBl",
        name: "Bls en attente",
        icon: "fas fa-check",
        component: ValidationBl,
        componentStr: "ValidationBl",
        role: [1,2],
        element: <ValidationBl />,
      },
      {
        path: "/visualisationBl",
        name: "Bls validés",
        icon: "nc-icon nc-tap-01",
        component: VisualisationBl,
        componentStr: "VisualisationBl",
        role: [0,1,2,3],
        element: <VisualisationBl />,
      },
    ],
  },
  {
    collapse: true,
    path: "/tableauDebord",
    name: "Tableau de bord",
    state: "tableauDebord",
    icon: "fas fa-tachometer-alt",
    role: [0,4,5],
    views: [
      {
        path: "/overview",
        name: "Overview",
        icon: "fas fa-chart-line",
        component: Overview,
        componentStr:"Overview",
        role: [0,4,5],
        element: <Overview />,
      },
      {
        path: "/packDashBoard",
        name: "Pack Dashboard",
        icon: "fas fa-chart-pie",
        component: PackDashBoard,
        componentStr:"PackDashBoard",
        role: [0,4,5],
        element: <PackDashBoard />,
      },
      {
        path: "/BlIms",
        name: "Bl-Ims",
        icon: "fas fa-chart-bar",
        component: BlIms,
        componentStr:"BlIms",
        role: [0,4,5],
        element: <BlIms />,
      },
    ],
  },
  {
    path: "/comparaisonIms",
    name: "Tableau BL-IMS",
    icon: "fas fa-exchange-alt",
    component: ComparaisonIms,
    role: [0],
    element: <ComparaisonIms />,
  },
  {
    collapse: true,
    path: "/workspace",
    name: "workspace",
    state: "workspace",
    icon: "fa fa-laptop-house",
    role: [0,1,2,5],
    views: [
      {
        path: "/ActionDashBoard",
        name: "Tableau de bord action",
        icon: "fas fa-tachometer-alt",
        component: ActionDashBoard,
        componentStr:"ActionDashBoard",
        role: [1,2,5],
        element:<ActionDashBoard />
      },
      {
        path: "/listAction",
        name: "Action commercial",
        icon: "nc-icon nc-single-02",
        component: ListAction,
        componentStr:"ListAction",
        role: [0,1,2,5],
        element:<ListAction />
      },
    ],
  },
  {
    collapse: true,
    path: "/IAmarketing",
    name: "IA marketing",
    state: "marketings",
    icon: "fas fa-bullhorn",
    role: [0,4,5],
    views: [
      {
        path: "/listPack",
        name: "packs",
        icon: "fas fa-gifts",
        component: ListPack,
        role: [0],
        element: <ListPack />,
      },
      {
        path: "/highlight",
        name: "highlight",
        icon: "far fa-lightbulb",
        role: [4,5],
        component: Highlight,
        element: <Highlight />,
      },
      {
        path: "/segments",
        name: "Segments",
        icon: "fas fa-tachometer-alt",
        role: [4,5],
        component: Segments,
        element: <Segments />,
      },
      {
        path: "/clustring",
        name: "clustring",
        icon: "fas fa-tachometer-alt",
        role: [4,5],
        component: Clustring,
        element: <Clustring />,
      },
      {
        path: "/mapping",
        name: "mapping",
        icon: "far fa-map",
        role: [4,5],
        component: Mapping,
        element: <Mapping />,
      },
      {
        path: "/transition",
        name: "Transition",
        icon: "fas fa-sync-alt",
        role: [4,5],
        component: Transition,
        element: <Transition />,
      },
      {
        path: "/ListAssociation",
        name: "Association",
        icon: "fas fa-users-cog",
        component: ListAssociation,
        role: [0,5],
        element: <ListAssociation />,
      },
      {
        path: "/segmentPharma",
        name: "Segment pharmacie",
        icon: "fas fa-users-cog",
        component: ListSegmentPharma,
        role: [0],
        element: <ListSegmentPharma />,
      },
    ],
  }, 
  {
    collapse: true,
    path: "/Settings",
    name: "Parametre",
    state: "openPages2",
    icon: "fas fa-cogs",
    role: [0,1,2,3],
    views: [ 
      {
        path: "/ImportIms",
        name: "Import Ims",
        icon: "fas fa-arrow-circle-down",
        component: ImportIms,
        role: [0,5],
        element: <ImportIms />,
      },
      {
        path: "/segmentList",
        name: "Segment",
        icon: "fas fa-users-cog",
        component: ListSegment,
        role: [0],
        element: <ListSegment />,
      },
      {
        path: "/roleList",
        name: "Role",
        icon: "fas fa-users-cog",
        component: ListRole,
        role: [0],
        element: <ListRole />,
      },
      {
        path: "/utilisateurListe",
        name: "Utilisateur",
        icon: "fas fa-users",
        component: ListUser,
        role: [0,1],
        element: <ListUser />,
      },
      {
        path: "/listPharmacie",
        name: "Parmacie",
        icon: "fas fa-prescription-bottle-alt",
        component: ListPharmacie,
        componentStr: "ListPharmacie",
        role: [20],
        element: <ListPharmacie />,
      },
      {
        path: "/listFournisseur",
        name: "Fournisseur",
        icon: "fa fa-warehouse",
        component: ListFournisseur,
        role: [0],
        element: <ListFournisseur />,
      },
      {
        path: "/listSecteur",
        name: "Secteur",
        icon: "nc-icon nc-puzzle-10",
        component: ListSecteur,
        role: [0],
        element: <ListSecteur />,
      },
      {
        path: "/bricksList",
        name: "Bricks",
        icon: "fas fa-map-marker-alt",
        component: ListIms,
        role: [0],
        element: <ListIms />,
      },
      {
        path: "/listMarcheIms",
        name: "Marché",
        icon: "fas fa-store",
        component: ListMarcheIms,
        role: [0],
        element: <ListMarcheIms />,
      },
      {
        path: "/listLigneIms",
        name: "Ligne Ims",
        icon: "fas fa-map-marker-alt",
        component: ListLigneIms,
        role: [0],
        element: <ListLigneIms />,
      },
      {
        path: "/produitList",
        name: "Produit",
        icon: "fas fa-pills",
        component: ListProduit,
        componentStr:"ListProduit",
        role: [0],
        element: <ListProduit />,
      },
      {
        path: "/produitListFour",
        name: "Produit fournisseur",
        icon: "fas fa-pills",
        component: ListProduitFour,
        componentStr:"ListProduitFour",
        role: [0],
        element: <ListProduitFour />,
      },
    ],
  },
  /* hidden */
  {
    path: "/ajouterSegment",
    name: "Ajouter segment",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterSegment,
    className: "hidden",
    role: [0],
    element: <AjouterSegment />,
  },
  {
    path: "/segment/update/:id",
    name: "Modifier segment",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterSegment,
    role: [0],
    className: "hidden",
    element: <AjouterSegment />,
  },
  {
    path: "/action/ajout",
    name: "Ajouter action",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterAction,
    className: "hidden",
    role: [0,5],
    element:<AjouterAction />
  },
  {
    path: "/ajouterSecteur",
    name: "Ajouter secteur",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterSecteur,
    className: "hidden",
    role: [0],
    element: <AjouterSecteur />,
  },
  {
    path: "/secteur/update/:id",
    name: "Modifier secteur",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterSecteur,
    role: [0],
    className: "hidden",
    element: <AjouterSecteur />,
  },
  {
    path: "/ajouterPack",
    name: "Ajouter pack",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterPack,
    className: "hidden",
    role: [0],
    element: <AjouterPack />,
  },
  {
    path: "/pack/update/:id",
    name: "Modifier pack",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterPack,
    role: [0],
    className: "hidden",
    element: <AjouterPack />,
  },
  {
    path: "/ajouterPharmacie",
    name: "Ajouter pharmacie",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterPharmacie,
    className: "hidden",
    role: [0],
    element: <AjouterPharmacie />,
  },
  {
    path: "/pharmacie/update/:id",
    name: "Modifier pharmacie",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterPharmacie,
    role: [0],
    className: "hidden",
    element: <AjouterPharmacie />,
  },
  {
    path: "/AjouterIms",
    name: "Ajouter bricks",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterIms,
    className: "hidden",
    role: [0],
    element: <AjouterIms />,
  },
  {
    path: "/bricks/update/:id",
    name: "Modifier bricks",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterIms,
    role: [0],
    className: "hidden",
    element: <AjouterIms />,
  },
  {
    path: "/ajouterFournisseur",
    name: "Ajouter fournisseur",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterFournisseur,
    className: "hidden",
    role: [0],
    element: <AjouterFournisseur />,
  },
  {
    path: "/fournisseur/update/:id",
    name: "Modifier fournisseur",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterFournisseur,
    role: [0],
    className: "hidden",
    element: <AjouterFournisseur />,
  },
  {
    path: "/ajouterMarcheIms",
    name: "Ajouter marché Ims",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterMarcheIms,
    className: "hidden",
    role: [0],
    element: <AjouterMarcheIms />,
  },
  {
    path: "/marche/update/:id",
    name: "Modifier marche",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterMarcheIms,
    role: [0],
    className: "hidden",
    element: <AjouterMarcheIms />,
  },
  {
    path: "/utilisateur/update/:id",
    name: "Modifier utilisateur",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterUser,
    role: [0],
    className: "hidden",
    element: <AjouterUser />,
  },
  {
    path: "/ajouterUtilisateur",
    name: "Ajouter utilisateur",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterUser,
    className: "hidden",
    role: [0,1],
    element: <AjouterUser />,
  },
  {
    path: "/utilisateur/update/:id",
    name: "Modifier utilisateur",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterUser,
    role: [0,1],
    className: "hidden",
    element: <AjouterUser />,
  },
  {
    path: "/ajouterLigneIms",
    name: "Ajouter ligne IMS",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterLigneIms,
    className: "hidden",
    role: [0],
    element: <AjouterLigneIms />,
  },
  {
    path: "/ligne/update/:id",
    name: "Modifier ligne",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterLigneIms,
    role: [0],
    className: "hidden",
    element: <AjouterLigneIms />,
  },
  {
    path: "/ajouterProduit",
    name: "Ajouter produit",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterProduit,
    className: "hidden",
    role: [0],
    element: <AjouterProduit />,
  },
  {
    path: "/produit/update/:id",
    name: "Modifier produit",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterProduit,
    role: [0,1],
    className: "hidden",
    element: <AjouterProduit />,
  },
  {
    path: "/ajouterRole",
    name: "Ajouter role",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterRole,
    className: "hidden",
    role: [0],
    element: <AjouterRole />,
  },
  {
    path: "/role/update/:id",
    name: "Modifier role",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterRole,
    role: [0],
    className: "hidden",
    element: <AjouterRole />,
  },

  {
    path: "/listRegions",
    name: "Region",
    icon: "fas fa-sort-amount-down",
    component: ListRegions,
    componentStr:"ListeProduits",
    role: [0,1,4,5],
    element: <ListRegions />,
  },

  {
    path: "/region/update/:id",
    name: "Modifier region",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterRegion,
    role: [0,1,4,5],
    // className: "hidden",
    element: <AjouterRegion />,
  },

  {
    path: "/ajouterPole",
    name: "Ajouter pole",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterPole,
    className: "hidden",
    role: [0],
    element: <AjouterPole />,
  },

  {
    path: "/pole/update/:id",
    name: "Modifier pole",
    icon: "nc-icon nc-ruler-pencil",
    component: AjouterPole,
    role: [0,1,4,5],
    // className: "hidden",
    element: <AjouterPole />,
  },


  {
    path: "/listPoles",
    name: "Poles",
    icon: "nc-icon nc-ruler-pencil",
    component: ListPoles,
    role: [0],
    element: <ListPoles />,
  },

  
  {
    path: "/AjouterVeille",
    name: "Ajoute Veille",
    icon: "fas fa-plus",
    component: AjouterVeille,
    role: [0],
    element: <AjouterVeille />,
  },

  {
    path: "/AjouterVeille",
    name: "Ajoute Veille",
    icon: "fas fa-plus",
    component: AjouterVeille,
    role: [0],
    element: <AjouterVeille />,
  },





  {
    path: "/settings",
    name: "Settings",
    mini: "LP",
    role: [0],
    className: "hidden",
    component: Settings,
    element: <Settings />,
  },
  {
    path: "/todoList/:id",
    name: "todoList",
    mini: "LP",
    role: [1,2],
    className: "hidden",
    componentStr:"ListTodo",
    component: ListTodo,
    element: <ListTodo />,
  },
  {
    path: "/visualisation/:id/:idLine",
    name: "ListVisualisation",
    mini: "LP",
    role: [0,1,2],
    className: "hidden",    
    componentStr:"ListVisualisation",
    component: ListVisualisation,
    element: <ListVisualisation />,
  },
  {
    path: "/discution/:id",
    name: "Messagerie",
    mini: "LP",
    role: [0,1,2],
    className: "hidden",
    componentStr:"Messagerie",
    component: Messagerie,
    element: <Messagerie />,
  },
  {
    path: "/TelechargerFichier/:id/:idBl",
    name: "TelechargerFichier",
    mini: "LP",
    role: [0,1,2],
    componentStr:"TelechargerFichier",
    className: "hidden",
    component: TelechargerFichier,
    element: <TelechargerFichier />,
  },

  /* end root hidden */
  {
    path: "/*",
    name: "404 not found",
    mini: "LP",
    role: [20],
    className: "hidden",
    component: NotFound,
    componentStr:"NotFound",
    element: <NotFound />,
  },
  {
    path: "/profile",
    name: "profile",
    mini: "LP",
    role: [20],
    className: "hidden",
    component: Profile,
    componentStr:"Profile",
    element: <Profile />,
  },
];
export default routes;
