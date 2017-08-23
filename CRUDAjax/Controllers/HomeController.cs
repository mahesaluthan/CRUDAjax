using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using CRUDAjax;

namespace CRUDAjax.Controllers
{
    public class HomeController : Controller
    {
        ContosoUniversity2Entities db = new ContosoUniversity2Entities();

        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult List()
        {
            var result = from p in db.People select p;
            return new JsonResult() { Data = result, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }

        public JsonResult Add(Person pers)
        {
            db.People.Add(pers);
            db.SaveChanges();

            return Json(pers, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getbyID(int ID)
        {
            var result = db.People.Find(ID);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Update(Person pers)
        {
            db.People.Add(pers);
            db.Entry(pers).State = EntityState.Modified;
            db.SaveChanges();

            return Json(pers , JsonRequestBehavior.AllowGet);
        }
   
        public JsonResult Delete(int ID)
        {

                Person result = db.People.Find(ID);
                db.People.Remove(result);
                db.SaveChanges();
           
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}
